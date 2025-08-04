import React from "react";

const Map: React.FC = () => {
  return (
    <div id="map-area">
     
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3725.429112884343!2d105.8669484747678!3d20.97542923960901!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ad763d83e173%3A0x3c47479ef6a38fc0!2sChung%20c%C6%B0%20Gelexia%20Riverside!5e0!3m2!1svi!2s!4v1746031266022!5m2!1svi!2s"
        width="100%"
        height="450"
        style={{ border: 0 }}
        loading="lazy"
        title="This is a unique title"
      ></iframe>
    </div>
  );
};

export default Map;
