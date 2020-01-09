/***
 Use this component inside your ReactJS Application.
 A scrollable list with different item type
 */
import * as React from 'react';
import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview/web';
import { useSelector } from 'react-redux';
import { OTBData } from '../../lib/types/Otb';
import ServerItem from '../../lib/ServerItem';
import { RootState } from '../reducers/index';

require('./ItemList.scss');
const img = require('./item.png');

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

const layoutProvider = new LayoutProvider(
  () => 0,
  (type, dim) => {
    dim.width = 500;
    dim.height = 70;
  }
);

// TODO Use this for more than one item per row
/*
new LayoutProvider(
  index => {
    if (index % 3 === 0) {
      return ViewTypes.FULL;
    } else if (index % 3 === 1) {
      return ViewTypes.HALF_LEFT;
    } else {
      return ViewTypes.HALF_RIGHT;
    }
  },
  (type, dim) => {
    switch (type) {
      case ViewTypes.HALF_LEFT:
        dim.width = width / 2 - 0.0001;
        dim.height = 160;
        break;
      case ViewTypes.HALF_RIGHT:
        dim.width = width / 2;
        dim.height = 160;
        break;
      case ViewTypes.FULL:
        dim.width = width;
        dim.height = 140;
        break;
      default:
        dim.width = 0;
        dim.height = 0;
    }
  }
);
*/

const renderRow = (type, item: ServerItem) => (
  <ItemContainer className="item-container">
    <img src={img} />
    <p>
      {item.id} - {item.name}
    </p>
  </ItemContainer>
);

const ItemList = () => {
  const items = useSelector((state: RootState) => state.items.otbData.items);
  const itemFilter = useSelector((state: RootState) => state.items.itemFilter);

  const [dataProvider, setDataProvider] = React.useState(
    new DataProvider((r1: ServerItem, r2: ServerItem) => r1.id !== r2.id)
  );

  React.useEffect(() => {
    setDataProvider(dataProvider.cloneWithRows(items.filter(item => itemFilter(item))));
  }, [items, itemFilter]);

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
