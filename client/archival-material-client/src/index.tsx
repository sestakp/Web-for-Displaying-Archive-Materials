import { createRoot } from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import "./styles/colorPalette.scss"
import "/node_modules/primeflex/primeflex.css"
import 'bootstrap/dist/css/bootstrap-grid.min.css';
import 'primeicons/primeicons.css';
import 'react-toastify/dist/ReactToastify.css';
import "./styles/theme.scss"
import './styles/index.scss';
import { Bounce, ToastContainer } from 'react-toastify';
import { PrimeReactProvider } from 'primereact/api';
import Router from './layout/Router';
import { ConfirmPopup } from 'primereact/confirmpopup';

const container = document.getElementById('root')!;
const root = createRoot(container);


root.render(
  <PrimeReactProvider>
        <>
          <Router />
          <ToastContainer
            pauseOnHover
            autoClose={3000}
            transition={Bounce}
            newestOnTop
            position="bottom-left"
            theme="colored"
            closeOnClick
          />
          <ConfirmPopup />
        </>
  </PrimeReactProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
