export default function IncidentCountCard({
  bgColor,
  // iconSrc,
  label,
  incidentCount,
}: {
  bgColor: string;
  // iconSrc: string;
  label: string;
  incidentCount: number;
}) {
  return (
    <div className="card" style={{ backgroundColor: bgColor }}>
      {/* <div className={`card-icon ${cssClass}`}>
        <img className="icon-property" src={iconSrc} alt={label} />
      </div> */}
      <div className="card-content">
        <h3>{label}</h3>
        <p>{incidentCount}</p>
      </div>
    </div>
  );
}
