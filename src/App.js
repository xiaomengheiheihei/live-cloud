import React, { Component } from 'react';
import '../node_modules/antd/dist/antd.css';
import { Provider } from 'mobx-react';
import { BrowserRouter} from 'react-router-dom';
import Routers from './routers/router';
import { loadStyle } from './utils/util'
// import DevTools from 'mobx-react-devtools';
import { stores } from './store/index'
import './static/style/index.scss'
// import { configureDevtool } from 'mobx-react-devtools';

// Any configurations are optional
// configureDevtool({
//   // Turn on logging changes button programmatically:
//   logEnabled: true,
//   // Turn off displaying components updates button programmatically:
//   updatesEnabled: false,
//   // Log only changes of type `reaction`
//   // (only affects top-level messages in console, not inside groups)
//   logFilter: change => change.type === 'reaction',
// });


loadStyle('//at.alicdn.com/t/font_938628_u2poxzzjzwb.css')

class App extends Component {
    render() {
        return (
          <div className="App">
              <Provider { ...stores }>
                  <BrowserRouter>
                      <Routers />
                  </BrowserRouter>
              </Provider>
              {/* <DevTools /> */}
          </div>
        );
    }
}
export default App;
