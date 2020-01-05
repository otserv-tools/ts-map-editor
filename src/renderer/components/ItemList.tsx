/***
 Use this component inside your ReactJS Application.
 A scrollable list with different item type
 */
import * as React from 'react';
import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview/web';
import memoize from 'memoize-one';
import { useSelector } from 'react-redux';
import { OTBData } from '../types/itemTypes';
import ServerItem from '../lib/ServerItem';
import { RootState } from '../reducers/index';

require('./ItemList.scss');
const img = require('./item.png');

const ViewTypes = {
  FULL: 0,
  HALF_LEFT: 1,
  HALF_RIGHT: 2
};

let containerCount = 0;
interface ItemContainerProps {
  style?: any;
  className?: string;
}

class ItemContainer extends React.Component<ItemContainerProps> {
  private containerId;
  constructor(args) {
    super(args);
    this.containerId = containerCount++;
  }

  render() {
    return <div {...this.props}>{this.props.children}</div>;
  }
}

interface Props {
  itemData: any;
  otbData: OTBData;
}

const excludedItems: number[] = [104, 106];

class ItemList extends React.Component<Props, { dataProvider: DataProvider }> {
  private layoutProvider;

  state = { dataProvider: new DataProvider((r1, r2) => r1 !== r2) };

  // Re-run the filter whenever the list array or filter text changes:
  filter = memoize((items: ServerItem[]) => items.filter(item => excludedItems.includes(item.id)));

  handleChange = event => {
    // this.setState({ items: event.target.value });
  };

  constructor(args) {
    super(args);

    // const width = window.innerWidth;

    // Create the data provider and provide method which takes in two rows of data and return if those two are different or not.
    //Create the layout provider
    //First method: Given an index return the type of item e.g ListItemType1, ListItemType2 in case you have variety of items in your list/grid
    //Second: Given a type and object set the height and width for that type on given object
    //If you need data based check you can access your data provider here
    //You'll need data in most cases, we don't provide it by default to enable things like data virtualization in the future
    //NOTE: For complex lists LayoutProvider will also be complex it would then make sense to move it to a different file
    this.layoutProvider = new LayoutProvider(
      () => ViewTypes.FULL,
      (type, dim) => {
        dim.width = 500;
        dim.height = 70;
      }
    );

    this.rowRenderer = this.rowRenderer.bind(this);

    //Since component should always render once data has changed, make data provider part of the state
    /*this.state = {
      dataProvider: dataProvider.cloneWithRows(this.props.otbData.items)
    };*/
  }

  generateArray(n: number) {
    const arr = new Array(n);
    for (let i = 0; i < n; i++) {
      arr[i] = { img, id: i, name: `Item ${i}` };
    }
    return arr;
  }

  //Given type and data return the view component
  rowRenderer(type, item) {
    return (
      <ItemContainer className="item-container">
        <img src={item.img} />
        <p>
          {item.id} - {item.name}
        </p>
      </ItemContainer>
    );
  }

  render() {
    console.log(this.props);
    return (
      <RecyclerListView
        style={styles.listStyle}
        layoutProvider={this.layoutProvider}
        dataProvider={this.state.dataProvider}
        rowRenderer={this.rowRenderer}
      />
    );
  }
}

const layoutProvider = new LayoutProvider(
  () => ViewTypes.FULL,
  (type, dim) => {
    dim.width = 500;
    dim.height = 70;
  }
);

const renderRow = (type, item: ServerItem) => (
  <ItemContainer className="item-container">
    <img src={img} />
    <p>
      {item.id} - {item.name}
    </p>
  </ItemContainer>
);

export const ItemList2 = () => {
  const items = useSelector((state: RootState) => state.items.otbData?.items);
  console.log('Items: ', items);

  const [dataProvider, setDataProvider] = React.useState(
    new DataProvider((r1: ServerItem, r2: ServerItem) => r1.id !== r2.id)
  );

  React.useEffect(() => {
    setDataProvider(dataProvider.cloneWithRows(items || []));
  }, [items]);

  return (
    <RecyclerListView
      style={styles.listStyle}
      layoutProvider={layoutProvider}
      dataProvider={dataProvider}
      rowRenderer={renderRow}
    />
  );
};

export default ItemList;

const styles = {
  listStyle: {
    height: '100%',
    width: '100%',
    background: '#fff'
  }
};
