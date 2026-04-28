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
import ClientCategoryProduct from "./screens/client/furtherScreen/ClientCategoryProduct";
import ClientsSubCategory from "./screens/client/furtherScreen/ClientsSubCategory";
import ClientProductDetailScreen from "./screens/client/furtherScreen/ClientProductDetailScreen";
import PagesScreen from "./screens/admin/PagesScreen";
import SubCategoryScreen from "./screens/admin/SubCategoryScreen";
import SubCategoryById from "./screens/admin/furtherScreen/SubCategoryById";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={12}
        containerStyle={{ top: 20, right: 20 }}
        toastOptions={{
          duration: 3000,
          style: {
            background: "rgba(15, 23, 42, 0.92)",
            color: "#ffffff",
            borderRadius: "18px",
            padding: "14px 18px",
            fontSize: "14px",
            fontWeight: "600",
            boxShadow: "0 18px 45px rgba(0,0,0,0.18)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(14px)",
            minWidth: "280px",
          },
          success: {
            iconTheme: { primary: "#22c55e", secondary: "#ffffff" },
            style: { borderLeft: "5px solid #22c55e" },
          },
          error: {
            iconTheme: { primary: "#ef4444", secondary: "#ffffff" },
            style: { borderLeft: "5px solid #ef4444" },
          },
          loading: {
            iconTheme: { primary: "#3b82f6", secondary: "#ffffff" },
            style: { borderLeft: "5px solid #3b82f6" },
          },
        }}
      />
      <BrowserRouter>
        <Routes>
          {/* admin */}
          <Route path="/admin" element={<AdminLayout />}>
            {/* add file path here in which you want to navigate */}
            <Route index element={<DashboardScreen />} />
            <Route path="dashboard" element={<DashboardScreen />} />
            <Route path="category" element={<CategoryScreen />} />
            <Route path="subcategory" element={<SubCategoryScreen />} />
            <Route path="category/:id" element={<CategoryById />} />
            <Route path="subcategory/:id" element={<SubCategoryById />} />
            <Route path="product/:id" element={<ProductById />} />
            <Route path="user/:id" element={<UserById />} />
            <Route path="product" element={<ProductScreen />} />
            <Route path="pages" element={<PagesScreen />} />
            <Route path="user" element={<UserScreen />} />
            <Route path="socialmedia" element={<SocialMediaScreen />} />
            <Route path="certificate" element={<CertificateScreen />} />
          </Route>

          {/* client */}
          <Route path="/" element={<ClientLayout />}>
            <Route index element={<ClientHomeScreen />} />
            <Route path="products" element={<ClientsProductScreen />} />
            <Route
              path="products/category/:id"
              element={<ClientCategoryProduct />}
            />
            <Route
              path="products/subcategory/:id"
              element={<ClientsSubCategory />}
            />
            <Route
              path="products/product/:id"
              element={<ClientProductDetailScreen />}
            />
            <Route path="aboutus" element={<AboutUs />} />
            <Route path="certificates" element={<ClientsCertificateScreen />} />
            <Route path="contact" element={<ContactUsScreen />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
