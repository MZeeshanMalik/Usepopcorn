import React, { useState } from "react";
import ReactDOM from "react-dom/client";
// import App from "./challange";
import "./App.css";
import "./index.css";
import App from "./App";
// import StarRating from "./StartRating";
// function Test() {
//   const [movieRating, setMovieRating] = useState(0);
//   return (
//     <div>
//       <StarRating color={"green"} setMovieRating={setMovieRating} />
//       <p>This movie was reted {movieRating} stars</p>
//     </div>
//   );
// }
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    {/* <App />
    <StarRating
      maxRating={5}
      messages={["terrible", "Bad", "Okay", "Good", "Amazing"]}
    />
    <StarRating maxRating={5} defaultRatings={4} />
    <Test /> */}
  </React.StrictMode>
);
