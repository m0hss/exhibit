import { pageMetadata } from "@/lib/metadata";
import { Entrance } from "@/components/Entrance";
import { FloorPlan } from "@/components/FloorPlan";
import { Gallery } from "@/components/Gallery";
import { GiftShop } from "@/components/GiftShop";
import { Room } from "@/components/Room";
import { config, rooms, trackVw } from "@/lib/exhibit";

export function generateMetadata() {
  return pageMetadata();
}

export default function Home() {
  return (
    <>
      <main id="main" tabIndex={-1} className="outline-none">
        <Entrance />
        <Gallery trackVw={trackVw} label={config.exhibition.title}>
          {rooms.map((room) => (
            <Room key={room.id} room={room} />
          ))}
        </Gallery>
        <GiftShop />
      </main>
      <FloorPlan
        rooms={rooms.map(({ id, numeral, title, widthVw }) => ({ id, numeral, title, widthVw }))}
        label={config.ui.minimap.label}
        jumpTemplate={config.ui.minimap.jump}
        roomWord={config.ui.room}
      />
    </>
  );
}
