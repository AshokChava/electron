const { BrowserWindow } = require('electron');

// default window settings
const defaultProps = {
  width: 800,
  height: 800,
  show: false,

  webPreferences: {
    nodeIntegration: true,
  },
};

class Window extends BrowserWindow {
  constructor({ file, ...windowSettings }) {
    super({ ...defaultProps, ...windowSettings });

    this.loadFile(file);
    // this.webContents.openDevTools()

    // gracefully show when ready to prevent flickering
    this.once('ready-to-show', () => {
      this.maximize();
      this.show();
    });
  }
}

module.exports = Window;
