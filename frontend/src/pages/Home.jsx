import { useNavigate } from "react-router-dom";

const ROLES = [
  {
    id: "manager",
    title: "Operations Manager",
    subtitle: "Dashboard · Centres · Reports",
    path: "/login/manager",
    variant: "accent",
  },
  {
    id: "staff",
    title: "Collection Staff",
    subtitle: "Entry desk · Live queue",
    path: "/login/staff",
    variant: "dark",
  },
  {
    id: "farmer",
    title: "Farmer",
    subtitle: "Payouts · Delivery history",
    path: "/login/farmer",
    variant: "dark",
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="page-center">
      <h1 className="title">Dairy Co-op Portal</h1>
      <p className="subtitle">Select your role to continue</p>

      <div className="role-grid">
        {ROLES.map((role) => (
          <button
            key={role.id}
            className={`role-card role-card--${role.variant}`}
            onClick={() => navigate(role.path)}
          >
            <span className="role-card__title">{role.title}</span>
            <span className="role-card__subtitle">{role.subtitle}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
