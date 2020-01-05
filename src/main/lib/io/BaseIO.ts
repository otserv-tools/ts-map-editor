export default class BaseIO {
  protected debug: boolean = false;

  setDebug(value: boolean) {
    this.debug = value;
  }

  protected abort(msg: string) {
    this.logError(msg);
    process.exit(1);
  }

  /**
   * Debug logging
   */
  protected logd(msg: string) {
    if (this.debug === true) {
      console.log(msg);
    }
  }

  protected log(msg: string) {
    console.log('[LOG] ' + msg);
  }

  protected logInfo(msg: string) {
    console.log('[INFO] ' + msg);
  }

  /**
   * Warning logging
   */
  protected logWarning(msg: string) {
    console.log('[WARN] ' + msg);
  }

  protected logError(msg: string) {
    console.log('[ERROR] ' + msg);
  }
}
