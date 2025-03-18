// import React from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'font-awesome/css/font-awesome.min.css';


// function Home() {
//     return (
//         <>
//             {/* Top Bar Start */}
//             <div className="top-bar d-none d-md-block">
//                 <div className="container-fluid">
//                     <div className="row">
//                         <div className="col-md-8">
//                             <p>Welcome to YOOGA</p>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             {/* Top Bar End */}

//             {/* Hero Section Start */}
//             <div className="container text-center" style={{ padding: '70px 10px' }}>
//                 <h2>Welcome to Yoga App</h2>
//                 <p>Your platform for Yoga registrations, sessions, and admin management.</p>
//                 <button className="btn btn-primary">Get Started</button>
//             </div>
//             {/* Hero Section End */}
//         </>
//     );
// }

// export default Home;

import React, { useEffect, useState } from "react";

function Home() {
    const [htmlContent, setHtmlContent] = useState("");

    useEffect(() => {
        fetch("/yoga_template/index.html") // ✅ Load the HTML file dynamically
            .then((response) => response.text())
            .then((data) => setHtmlContent(data))
            .catch((error) => console.error("Error loading HTML:", error));
    }, []);

    return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
}

export default Home;



