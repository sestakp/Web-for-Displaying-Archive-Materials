import { OverlayPanel } from 'primereact/overlaypanel';
import Badge from '../badge/Badge';
import { useRef } from 'react';
import LocationListDto from '../../models/Location/LocationListDto';
import styles from "./LocationBadge.module.scss"

interface LocationBadgeProps {
    locations: LocationListDto[];
}


const LocationBadge: React.FC<LocationBadgeProps> = ({locations}) => {
    const overlayPanelRef = useRef<OverlayPanel | null>(null);

    function handleMouseOver(event: React.MouseEvent<HTMLDivElement>) {
      if(overlayPanelRef?.current != null){

        (overlayPanelRef.current as any).show(event)
        event.stopPropagation();
        event.preventDefault();
      }
    }
    
      function handleMouseLeave(event: React.MouseEvent<HTMLDivElement>) {
        if(overlayPanelRef?.current != null){
          (overlayPanelRef.current as any).hide(event)
          event.stopPropagation();
          event.preventDefault();
        }
      }

    return(
        <div onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave} onClick={(e) => { e.stopPropagation()}} onContextMenu={(e) => e.stopPropagation()}>
              <Badge value={locations?.length} />
              {locations?.length > 0 &&
                <OverlayPanel ref={overlayPanelRef} >
                  <div style={{ width: '100%', maxHeight: '200px', overflow: "auto" }} >
                  {locations.map((lo, index) => 
                    <p key={index}>{lo.municipality} {lo.borough != undefined && <span>({lo.borough})</span>}</p>
                  )}
                  </div>
              </OverlayPanel>
              }
              
        </div>
    )

    /*
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const overlayPanelRef = useRef<OverlayPanel | null>(null);

  function handleMouseOver(event: React.MouseEvent<HTMLDivElement>) {
    setIsOverlayOpen(true);
    event.stopPropagation(); // Prevent bubbling to parent elements
  }

  function handleMouseLeave(event: React.MouseEvent<HTMLDivElement>) {
    setIsOverlayOpen(false);
  }

  const overlayContent = (
    <div>
      {locations.map((lo) => (
        <p key={lo.municipality}>{lo.municipality}</p>
      ))}
    </div>
  );

  return (
    <div onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave}>
      <Badge value={locations?.length} />
      <OverlayPanel
        show={isOverlayOpen}
        target={overlayPanelRef.current}
        placement="top"
        container={document.body} // Optional container for specific positioning
        rootClose={true} // Close on mouse leave outside of badge and overlay
      >
        {overlayContent}
      </OverlayPanel>
    </div>
  );*/
}

export default LocationBadge;