export default function EventContent(eventInfo: any) {
    return (
      <div
        onClick={() => alert(eventInfo.event.title + " " + eventInfo.timeText)}
        className="cursor-pointer p-5 bg-sky-200 border border-sky-100r rounded-xl text-black flex flex-col items-center justify-center w-full h-full"
      >
        <p className="text-center font-bold">{eventInfo.event.title}</p>
        {/* <p>{eventInfo.timeText}</p> */}
        <p className="text-sm">{eventInfo.event.extendedProps.room}</p>
      </div>
    );
  }