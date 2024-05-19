import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login, SignUp, Home, PageNotFound, Layout, FormPage } from './index.js';
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
          <Route path="/" element={<Layout />}>
            <Route path="/" index element={<Home />} />
            <Route path="/abc" index element={<FormPage />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<SignUp />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;