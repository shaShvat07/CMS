import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login, SignUp, FormPage } from './index.js';
// import PageNotFound from './PageNotFound/PageNotFound';
import { Toaster } from 'react-hot-toast';

function App() {

  return (
    <>
      <BrowserRouter>
          <div>
            <Toaster
              position="top-right"
              reverseOrder={false}
            />
          </div>
        <Routes >
          <Route path="/" index element={<FormPage />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<SignUp />} />
          {/* <Route path="*" element={<PageNotFound />} /> */}
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App