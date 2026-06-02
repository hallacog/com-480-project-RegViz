let gvaDict = {};

const container = d3.select("#map-container");
let width = parseFloat(container.style("width"));
let height = parseFloat(container.style("height"));

const svg = container.append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

const g = svg.append("g");

const projection = d3.geoAzimuthalEqualArea()
    .center([18, 52.5]) 
    .rotate([0, 0])
    .scale(1300) 
    .translate([width / 2, height / 2]);

const pathGenerator = d3.geoPath().projection(projection);
const sidebarContent = d3.select("#details-content");

const VARIABLES = [
    "Agriculture (A)", "Industry (B-E)", "Manufacturing (C)", "Construction (F)",
    "Trade & Transport (G-I)", "Information & ICT (J)", "Financial & Insur. (K)",
    "Real Estate (L)", "Profess. & Business (M-N)", "Public Admin & Health (O-Q)"
];

const zoomBehavior = d3.zoom()
    .scaleExtent([1, 12]) 
    .extent([[0, 0], [width, height]])
    .translateExtent([[0, 0], [width, height]]) 
    .on("zoom", (event) => {
        g.attr("transform", event.transform);
        g.selectAll(".country").style("stroke-width", `${0.4 / event.transform.k}px`);
        g.selectAll(".nation").style("stroke-width", `${1.5 / event.transform.k}px`);
    });
svg.call(zoomBehavior);

const eurostatApiUrl = "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/nama_10r_3gva?format=JSON&time=2024&unit=CP_MEUR&nace_r2=A&nace_r2=B-E&nace_r2=F&nace_r2=G-I&nace_r2=J&nace_r2=K&nace_r2=L&nace_r2=M_N&nace_r2=O-Q&nace_r2=R-U&nace_r2=TOTAL&lang=EN";

Promise.all([
    d3.json("https://gisco-services.ec.europa.eu/distribution/v2/nuts/geojson/NUTS_RG_03M_2024_4326_LEVL_3.geojson"),
    d3.json("https://gisco-services.ec.europa.eu/distribution/v2/nuts/geojson/NUTS_RG_03M_2024_4326_LEVL_0.geojson"),
    d3.json(eurostatApiUrl)
]).then(([nutsData, countryData, eurostatJson]) => {
    
    buildFilteredGvaDictionary(eurostatJson);

    const excluded = ["UA", "MD", "BA"];
    const filteredFeatures = nutsData.features.filter(d => 
        !excluded.includes(d.properties.NUTS_ID?.substring(0, 2))
    );

    g.selectAll(".country")
        .data(filteredFeatures)
        .enter()
        .append("path")
        .attr("class", "country")
        .classed("no-data", d => {
            const id = d.properties.NUTS_ID?.trim();
            const data = gvaDict[id];
            return !data || data.every(v => v === 0);
        })
        .attr("d", pathGenerator)
        .on("click", function(event, d) {
            g.selectAll(".country").classed("selected", false);
            d3.select(this).classed("selected", true);

            const id = d.properties.NUTS_ID?.trim();
            const regionName = d.properties.NAME_LATN || d.properties.NUTS_NAME || "Unknown Region";
            const countryCode = id.substring(0, 2);
            const hasData = gvaDict[id] && gvaDict[id].some(v => v > 0);

            sidebarContent.html(`
                <div class="metric-group"><div class="metric-label">Region Name</div><div class="metric-value">${regionName}</div></div>
                <div class="metric-group"><div class="metric-label">Country Code</div><div class="metric-value">${countryCode}</div></div>
                <div class="metric-group"><div class="metric-label">NUTS 3 Code</div><div class="metric-value" style="font-family: monospace;">${id}</div></div>
                ${hasData ? '<div class="metric-label" style="margin-top:25px;">NACE Activity Profile</div><div id="radar-chart-container"></div>' : '<div class="metric-label" style="margin-top:25px; color:#888;">No economic data available for this region.</div>'}
            `);
            
            if (hasData) {
                drawRadarChart("#radar-chart-container", gvaDict[id].map((v, i) => ({ axis: VARIABLES[i], value: v })));
            }
        });

    g.selectAll(".nation")
        .data(countryData.features.filter(d => !excluded.includes(d.properties.NUTS_ID?.substring(0, 2))))
        .enter().append("path").attr("class", "nation").attr("d", pathGenerator);

    function buildFilteredGvaDictionary(data) {
        const values = data.value;
        const dims = data.dimension;
        const numGeo = Object.keys(dims.geo.category.index).length;
        const naceKeys = Object.keys(dims.nace_r2.category.index).filter(k => k !== 'TOTAL').sort((a,b) => dims.nace_r2.category.index[a] - dims.nace_r2.category.index[b]);
        const totalNaceIndex = dims.nace_r2.category.index['TOTAL'];
        
        Object.keys(dims.geo.category.index).filter(k => k.length === 5).forEach(geoKey => {
            const gIndex = dims.geo.category.index[geoKey];
            const totalGva = values[(totalNaceIndex * numGeo) + gIndex];
            if (totalGva > 0) {
                gvaDict[geoKey.trim()] = naceKeys.map(naceKey => (values[(dims.nace_r2.category.index[naceKey] * numGeo) + gIndex] || 0) / totalGva);
            }
        });
    }

    function drawRadarChart(selector, data) {
        d3.select(selector).selectAll("*").remove();
        const rWidth = 340, rHeight = 310, margin = 65, radius = Math.min(rWidth, rHeight) / 2 - margin;
        const rSvg = d3.select(selector).append("svg").attr("width", "100%").attr("height", rHeight).attr("viewBox", `0 0 ${rWidth} ${rHeight}`).append("g").attr("transform", `translate(${rWidth/2}, ${rHeight/2})`);
        const rScale = d3.scaleLinear().domain([0, 0.35]).range([0, radius]);
        const angleStep = (Math.PI * 2) / data.length;
        
        [0.0875, 0.175, 0.2625, 0.35].forEach(level => {
            let pathData = "";
            for(let i=0; i<=data.length; i++){
                const angle = i*angleStep - Math.PI/2;
                pathData += (i===0 ? "M" : "L") + `${rScale(level)*Math.cos(angle)},${rScale(level)*Math.sin(angle)}`;
            }
            rSvg.append("path").attr("class", "radar-grid-ring").attr("d", pathData + "Z");
        });

        data.forEach((d, i) => {
            const angle = i * angleStep - Math.PI / 2;
            rSvg.append("line").attr("class", "radar-axis-line").attr("x2", rScale(0.35)*Math.cos(angle)).attr("y2", rScale(0.35)*Math.sin(angle));
            rSvg.append("text").attr("class", "radar-axis-label").attr("x", rScale(0.4)*Math.cos(angle)).attr("y", rScale(0.4)*Math.sin(angle)).text(d.axis.split(" (")[0]);
        });
        
        const line = d3.line().x((d, i) => rScale(Math.min(d.value, 0.35))*Math.cos(i*angleStep - Math.PI/2)).y((d, i) => rScale(Math.min(d.value, 0.35))*Math.sin(i*angleStep - Math.PI/2));
        rSvg.append("path").datum([...data, data[0]]).attr("class", "radar-area").attr("d", line);
    }

    window.addEventListener("resize", () => {
        width = parseFloat(container.style("width"));
        height = parseFloat(container.style("height"));
        svg.attr("viewBox", `0 0 ${width} ${height}`);
        zoomBehavior.extent([[0, 0], [width, height]]).translateExtent([[0, 0], [width, height]]);
    });
}).catch(e => console.error(e));