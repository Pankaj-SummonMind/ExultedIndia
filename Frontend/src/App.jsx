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
        </Route>

        {/* client */}
        {/* add clients side file path url here inside the route*/}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
