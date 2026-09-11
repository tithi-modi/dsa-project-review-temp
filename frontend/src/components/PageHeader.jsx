export default function PageHeader({ title, subtitle, onLogout }) {
  return (
    <div className="page-header">
      <div>
        <h1 className="title title--small">{title}</h1>
        {subtitle && <p className="subtitle subtitle--left">{subtitle}</p>}
      </div>
      {onLogout && (
        <button className="btn btn-ghost" onClick={onLogout}>
          Log out
        </button>
      )}
    </div>
  );
}
