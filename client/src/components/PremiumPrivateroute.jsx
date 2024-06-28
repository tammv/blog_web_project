import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

export default function PremiumPrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);
  return currentUser && currentUser.isPremium ? <Outlet /> : <Navigate to="/payment" />;
}
