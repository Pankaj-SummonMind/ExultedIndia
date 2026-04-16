import { BrowserRouter,Routes,Route } from "react-router-dom";
import AdminLayout from "./layout/AdminLayout";
import DashboardScreen from "./screens/admin/DashboardScreen";
import CategoryScreen from "./screens/admin/CategoryScreen";
import ProductScreen from "./screens/admin/ProductScreen";
import UserScreen from "./screens/admin/UserScreen";

function App() {
  return(
    <BrowserRouter>
      <Routes>
        {/* admin */}
        <Route path="/admin" element={<AdminLayout />}>
        {/* add file path here in which you want to navigate */}
        <Route index element={<DashboardScreen />} />
          <Route path="dashboard" element={<DashboardScreen />} />
          <Route path="category" element={<CategoryScreen />} />
          <Route path="product" element={<ProductScreen />} />
          <Route path="user" element={<UserScreen />} />
        </Route>

        {/* client */}
        {/* add clients side file path url here inside the route*/}
      </Routes>
    </BrowserRouter>
  )
}

export default App;