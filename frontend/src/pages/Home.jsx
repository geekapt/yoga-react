import React, { useEffect, useState } from "react";

function Home() {
    const [htmlContent, setHtmlContent] = useState("");
    const [packages, setPackages] = useState([]);

    // Fetch the HTML template
    useEffect(() => {
        fetch("/yoga_template/index.html")
            .then((response) => response.text())
            .then((data) => setHtmlContent(data))
            .catch((error) => console.error("Error loading HTML:", error));
    }, []);

    // Fetch Gym Packages from Backend
    useEffect(() => {
        fetch("http://192.168.68.200:5000/gym-packages")
            .then((response) => response.json())
            .then((data) => setPackages(data))
            .catch((error) => console.error("Error fetching packages:", error));
    }, []);

    // Inject Packages into HTML after it loads
    useEffect(() => {
        if (htmlContent && packages.length > 0) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlContent, "text/html");

            const packageContainer = doc.querySelector(".price .row"); // Target the section

            if (packageContainer) {
                packageContainer.innerHTML = ""; // Clear existing static content

                packages.forEach((pkg, index) => {
                    const delay = index * 0.3; // Dynamic animation delay
                    const isFeatured = index === 1 ? "featured-item" : "";

                    const packageHTML = `
                        <div class="col-md-4 wow fadeInUp" data-wow-delay="${delay}s">
                            <div class="price-item ${isFeatured}">
                                ${isFeatured ? '<div class="price-status"><span>Popular</span></div>' : ""}
                                <div class="price-header">
                                    <div class="price-title">
                                        <h2>${pkg.name}</h2>
                                    </div>
                                    <div class="price-prices">
                                        <h2><small>$</small>${pkg.price}<span>/ mo</span></h2>
                                    </div>
                                </div>
                                <div class="price-body">
                                    <div class="price-description">
                                        <ul>
                                            ${pkg.details.split("\n").map((line) => `<li>${line}</li>`).join("")}
                                        </ul>
                                    </div>
                                </div>
                                <div class="price-footer">
                                    <div class="price-action">
                                        <a class="btn" href="#">Join Now</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;

                    packageContainer.innerHTML += packageHTML;
                });

                setHtmlContent(doc.documentElement.outerHTML); // Update state with modified HTML
            }
        }
    }, [htmlContent, packages]);

    return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
}

export default Home;
