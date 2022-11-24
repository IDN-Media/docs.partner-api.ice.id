import React from "react";
import ReactDOM from "react-dom";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export default function Swagger() {
  return (
    <div className="swagger">
      <SwaggerUI url="partner-api.yaml" />
    </div>
  );
}
