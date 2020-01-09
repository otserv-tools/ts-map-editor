export default class Logger {
  protected debug: boolean = false;

  setDebug(value: boolean) {
    this.debug = value;
  }

  abort(msg: string) {
    this.logError(msg);
    process.exit(1);
  }

  /**
   * Debug logging
   */
  logd(msg: string) {
    if (this.debug === true) {
      console.log(msg);
    }
  }

  log(msg: string) {
    console.log('[LOG] ' + msg);
  }

  logInfo(msg: string) {
    console.log('[INFO] ' + msg);
  }

  /**
   * Warning logging
   */
  logWarning(msg: string) {
    console.log('[WARN] ' + msg);
  }

  logError(msg: string) {
    console.log('[ERROR] ' + msg);
  }
}
