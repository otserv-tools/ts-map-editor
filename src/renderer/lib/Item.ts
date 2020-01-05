import { ushort, uint32 } from '../types';
import { ServerItemType, TileStackOrder, ServerItemFlag } from './enums';
import Sprite from './Sprite';

export default class Item {
  id: ushort;
  itemType: ServerItemType = ServerItemType.None;
  hasStackOrder: boolean;
  stackOrder: TileStackOrder = TileStackOrder.None;
  walkable: boolean = true;
  blockMissiles: boolean;
  blockPathfinder: boolean;
  hasElevation: boolean;
  forceUse: boolean;
  multiUse: boolean;
  pickupable: boolean;
  noMoveAnimation: boolean;
  movable: boolean = true;
  stackable: boolean;
  readable: boolean;
  rotatable: boolean;
  hangable: boolean;
  hookSouth: boolean;
  hookEast: boolean;
  hasCharges: boolean;
  ignoreLook: boolean;
  fullGround: boolean;
  allowDistanceRead: boolean;
  isAnimation: boolean;
  groundSpeed: ushort;
  lightIntensity: ushort;
  lightColor: ushort;
  translucent: boolean;
  maxReadChars: ushort;
  maxReadWriteChars: ushort;
  minimapColor: ushort;
  tradeAs: ushort;
  name: string = '';

  spriteList: Sprite[] = [];

  public setFlags(flags: uint32) {
    this.walkable = (flags & ServerItemFlag.Unpassable) === ServerItemFlag.Unpassable;
    this.blockMissiles = (flags & ServerItemFlag.BlockMissiles) === ServerItemFlag.BlockMissiles;
    this.blockPathfinder =
      (flags & ServerItemFlag.BlockPathfinder) === ServerItemFlag.BlockPathfinder;
    this.hasElevation = (flags & ServerItemFlag.HasElevation) === ServerItemFlag.HasElevation;
    this.forceUse = (flags & ServerItemFlag.ForceUse) === ServerItemFlag.ForceUse;
    this.multiUse = (flags & ServerItemFlag.MultiUse) === ServerItemFlag.MultiUse;
    this.pickupable = (flags & ServerItemFlag.Pickupable) === ServerItemFlag.Pickupable;
    this.movable = (flags & ServerItemFlag.Movable) === ServerItemFlag.Movable;
    this.stackable = (flags & ServerItemFlag.Stackable) === ServerItemFlag.Stackable;
    this.hasStackOrder = (flags & ServerItemFlag.StackOrder) === ServerItemFlag.StackOrder;
    this.readable = (flags & ServerItemFlag.Readable) === ServerItemFlag.Readable;
    this.rotatable = (flags & ServerItemFlag.Rotatable) === ServerItemFlag.Rotatable;
    this.hangable = (flags & ServerItemFlag.Hangable) === ServerItemFlag.Hangable;
    this.hookSouth = (flags & ServerItemFlag.HookSouth) === ServerItemFlag.HookSouth;
    this.hookEast = (flags & ServerItemFlag.HookEast) === ServerItemFlag.HookEast;
    this.allowDistanceRead =
      (flags & ServerItemFlag.AllowDistanceRead) === ServerItemFlag.AllowDistanceRead;
    this.hasCharges = (flags & ServerItemFlag.ClientCharges) === ServerItemFlag.ClientCharges;
    this.ignoreLook = (flags & ServerItemFlag.IgnoreLook) === ServerItemFlag.IgnoreLook;
    this.fullGround = (flags & ServerItemFlag.FullGround) === ServerItemFlag.FullGround;
    this.isAnimation = (flags & ServerItemFlag.IsAnimation) === ServerItemFlag.IsAnimation;
  }
}
