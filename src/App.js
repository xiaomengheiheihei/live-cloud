import React, { Component } from 'react';
import '../node_modules/antd/dist/antd.css';
import { Provider } from 'mobx-react';
import { BrowserRouter} from 'react-router-dom';
import Routers from './routers/router';
import { loadStyle } from './utils/util'
// import { initializeStore as Root_store } from './store/index'


loadStyle('//at.alicdn.com/t/font_938628_zc6t59d9u9c.css')

class App extends Component {
    render() {
        return (
          <div className="App">
              {/* <Provider { ...Root_store }> */}
                  <BrowserRouter>
                      <Routers />
                  </BrowserRouter>
              {/* </Provider> */}
          </div>
        );
    }
}
export default App;
