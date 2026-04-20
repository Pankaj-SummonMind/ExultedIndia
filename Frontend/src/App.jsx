import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./layout/AdminLayout";
import DashboardScreen from "./screens/admin/DashboardScreen";
import CategoryScreen from "./screens/admin/CategoryScreen";
import ProductScreen from "./screens/admin/ProductScreen";
import UserScreen from "./screens/admin/UserScreen";
import CategoryById from "./screens/admin/furtherScreen/CategoryById";
import ProductById from "./screens/admin/furtherScreen/ProductById";
import UserById from "./screens/admin/furtherScreen/UserByid";
import SocialMediaScreen from "./screens/admin/SocialMediaScreen";
import ClientLayout from "./layout/ClientLayout";
import ClientHomeScreen from "./screens/client/ClientHomeScreen";
import ClientsProductScreen from "./screens/client/ClientsProductScreen";
import AboutUs from "./screens/client/AboutUs";
import ContactUsScreen from "./screens/client/ContactUsScreen";
import ClientsCertificateScreen from "./screens/client/ClientsCertificateScreen";
import CertificateScreen from "./screens/admin/CertificateScreen";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* admin */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* add file path here in which you want to navigate */}
          <Route index element={<DashboardScreen />} />
          <Route path="dashboard" element={<DashboardScreen />} />
          <Route path="category" element={<CategoryScreen />} />
          <Route path="category/:id" element={<CategoryById />} />
          <Route path="product/:id" element={<ProductById />} />
          <Route path="user/:id" element={<UserById />} />
          <Route path="product" element={<ProductScreen />} />
          <Route path="user" element={<UserScreen />} />
          <Route path="socialmedia" element={<SocialMediaScreen />} />
          <Route path="certificate" element={<CertificateScreen />} />
        </Route>

        {/* client */}
        <Route path="/" element={<ClientLayout />}>
          <Route index element={<ClientHomeScreen />} />
          <Route path="products" element={<ClientsProductScreen />} />
          <Route path="products/category/:id" element={<ClientHomeScreen />} />
          <Route
            path="products/subcategory/:id"
            element={<ClientHomeScreen />}
          />
          <Route path="aboutus" element={<AboutUs />} />
          <Route path="certificates" element={<ClientsCertificateScreen />} />
          <Route path="contact" element={<ContactUsScreen />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
