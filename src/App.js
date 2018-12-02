import React, { Component } from 'react';
import '../node_modules/antd/dist/antd.css';
// import { Provider } from 'react-redux'
import { BrowserRouter} from 'react-router-dom';
import Routers from './routers/router';
import { loadStyle } from './utils/util'


loadStyle('//at.alicdn.com/t/font_938628_zc6t59d9u9c.css')

class App extends Component {
    render() {
        return (
          <div className="App">
              {/* <Provider> */}
                  <BrowserRouter>
                      <Routers />
                  </BrowserRouter>
              {/* </Provider> */}
          </div>
        );
    }
}
export default App;
