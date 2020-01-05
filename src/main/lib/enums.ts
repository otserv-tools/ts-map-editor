export enum Token {
  Escape = 0xfd,
  Start = 0xfe,
  End = 0xff,
  OTBM_ROOTV1 = 0x01
}

export enum ServerItemGroup {
  None = 0,

  Ground = 0x01,
  Container = 0x02,
  Weapon = 0x03, // Deprecated
  Ammunition = 0x04, // Deprecated
  Armor = 0x05, // Deprecated
  Changes = 0x06,
  Teleport = 0x07, // Deprecated
  MagicField = 0x08, // Deprecated
  Writable = 0x09, // Deprecated
  Key = 0x0a, // Deprecated
  Splash = 0x0b,
  Fluid = 0x0c,
  Door = 0x0d, // Deprecated
  Deprecated = 0x0e,
  Last = 0x0f
}

export enum TileStackOrder {
  None = 0,
  Border = 1,
  Bottom = 2,
  Top = 3
}

export enum ServerItemType {
  None = 0,
  Ground = 1,
  Container = 2,
  Fluid = 3,
  Splash = 4,
  Deprecated = 5
}

export enum ServerItemFlag {
  None = 0,
  Unpassable = 1 << 0,
  BlockMissiles = 1 << 1,
  BlockPathfinder = 1 << 2,
  HasElevation = 1 << 3,
  MultiUse = 1 << 4,
  Pickupable = 1 << 5,
  Movable = 1 << 6,
  Stackable = 1 << 7,
  FloorChangeDown = 1 << 8,
  FloorChangeNorth = 1 << 9,
  FloorChangeEast = 1 << 10,
  FloorChangeSouth = 1 << 11,
  FloorChangeWest = 1 << 12,
  StackOrder = 1 << 13,
  Readable = 1 << 14,
  Rotatable = 1 << 15,
  Hangable = 1 << 16,
  HookSouth = 1 << 17,
  HookEast = 1 << 18,
  CanNotDecay = 1 << 19,
  AllowDistanceRead = 1 << 20,
  Unused = 1 << 21,
  ClientCharges = 1 << 22,
  IgnoreLook = 1 << 23,
  IsAnimation = 1 << 24,
  FullGround = 1 << 25,
  ForceUse = 1 << 26
}

export enum ServerItemAttribute {
  ServerID = 0x10,
  ClientID = 0x11,
  Name = 0x12,
  GroundSpeed = 0x14,
  SpriteHash = 0x20,
  MinimapColor = 0x21,
  MaxReadWriteChars = 0x22,
  MaxReadChars = 0x23,
  Light = 0x2a,
  StackOrder = 0x2b,
  TradeAs = 0x2d
}

export function showServerItemAttribute(attribute: ServerItemAttribute): string {
  switch (attribute) {
    case ServerItemAttribute.ServerID:
      return 'ServerItemAttribute.ServerID';
    case ServerItemAttribute.ClientID:
      return 'ServerItemAttribute.ClientID';
    case ServerItemAttribute.GroundSpeed:
      return 'ServerItemAttribute.GroundSpeed';
    case ServerItemAttribute.Name:
      return 'ServerItemAttribute.Name';
    case ServerItemAttribute.SpriteHash:
      return 'ServerItemAttribute.SpriteHash';
    case ServerItemAttribute.MinimapColor:
      return 'ServerItemAttribute.MinimapColor';
    case ServerItemAttribute.MaxReadWriteChars:
      return 'ServerItemAttribute.MaxReadWriteChars';
    case ServerItemAttribute.MaxReadChars:
      return 'ServerItemAttribute.MaxReadChars';
    case ServerItemAttribute.Light:
      return 'ServerItemAttribute.Light';
    case ServerItemAttribute.StackOrder:
      return 'ServerItemAttribute.StackOrder';
    case ServerItemAttribute.TradeAs:
      return 'ServerItemAttribute.TradeAs';
    default:
      return 'Unknown attribute';
  }
}

export enum DatFlag {
  Ground = 0,
  GroundBorder = 1,
  OnBottom = 2,
  OnTop = 3,
  Container = 4,
  Stackable = 5,
  ForceUse = 6,
  MultiUse = 7,
  Writable = 8,
  WritableOnce = 9,
  FluidContainer = 10,
  Splash = 11,
  NotWalkable = 12,
  NotMoveable = 13,
  BlockProjectile = 14,
  NotPathable = 15,
  NoMoveAnimation = 16,
  Pickupable = 17,
  Hangable = 18,
  HookSouth = 19,
  HookEast = 20,
  Rotatable = 21,
  Light = 22,
  DontHide = 23,
  Translucent = 24,
  Displacement = 25,
  Elevation = 26,
  LyingCorpse = 27,
  AnimateAlways = 28,
  MinimapColor = 29,
  LensHelp = 30,
  FullGround = 31,
  IgnoreLook = 32,
  Cloth = 33,
  Market = 34,
  DefaultAction = 35,
  Wrappable = 36,
  Unwrappable = 37,
  TopEffect = 38,

  NotPreWalkable = 100,
  Unknown = 101,

  Usable = 254,

  LastAttr = 255
}

export function showDatFlag(flag: DatFlag): string {
  switch (flag) {
    case DatFlag.Ground:
      return 'Ground';
    case DatFlag.GroundBorder:
      return 'GroundBorder';
    case DatFlag.OnBottom:
      return 'OnBottom';
    case DatFlag.OnTop:
      return 'OnTop';
    case DatFlag.Container:
      return 'Container';
    case DatFlag.Stackable:
      return 'Stackable';
    case DatFlag.ForceUse:
      return 'ForceUse';
    case DatFlag.MultiUse:
      return 'MultiUse';
    case DatFlag.Writable:
      return 'Writable';
    case DatFlag.WritableOnce:
      return 'WritableOnce';
    case DatFlag.FluidContainer:
      return 'FluidContainer';
    case DatFlag.Splash:
      return 'Splash';
    case DatFlag.NotWalkable:
      return 'NotWalkable';
    case DatFlag.NotMoveable:
      return 'NotMoveable';
    case DatFlag.BlockProjectile:
      return 'BlockProjectile';
    case DatFlag.NotPathable:
      return 'NotPathable';
    case DatFlag.Pickupable:
      return 'Pickupable';
    case DatFlag.Hangable:
      return 'Hangable';
    case DatFlag.HookSouth:
      return 'HookSouth';
    case DatFlag.HookEast:
      return 'HookEast';
    case DatFlag.Rotatable:
      return 'Rotatable';
    case DatFlag.Light:
      return 'Light';
    case DatFlag.DontHide:
      return 'DontHide';
    case DatFlag.Translucent:
      return 'Translucent';
    case DatFlag.Displacement:
      return 'Displacement';
    case DatFlag.Elevation:
      return 'Elevation';
    case DatFlag.LyingCorpse:
      return 'LyingCorpse';
    case DatFlag.AnimateAlways:
      return 'AnimateAlways';
    case DatFlag.MinimapColor:
      return 'MinimapColor';
    case DatFlag.LensHelp:
      return 'LensHelp';
    case DatFlag.FullGround:
      return 'FullGround';
    case DatFlag.IgnoreLook:
      return 'IgnoreLook';
    case DatFlag.Cloth:
      return 'Cloth';
    case DatFlag.Market:
      return 'Market';
    case DatFlag.Usable:
      return 'Usable';
    case DatFlag.Wrappable:
      return 'Wrappable';
    case DatFlag.Unwrappable:
      return 'Unwrappable';
    case DatFlag.TopEffect:
      return 'TopEffect';
    case DatFlag.NotPreWalkable:
      return 'NotPreWalkable';
    case DatFlag.Unknown:
      return 'Unknown';
    case DatFlag.LastAttr:
      return 'LastAttr';
    default:
      return 'Unknown flag';
  }
}
