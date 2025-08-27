# F1 Standings Explorer
F1 Standings Explorer is a full stack web app for exploring Formula 1 seasons results. When F1 fans look up season standings online, they usually find a simple table with current totals. F1 Standings Explorer offers F1 fans the option to explore season standings of the current season and previous seasons with data visualizations and interactive graphs. How close was the WDC championship halfway through the year in 2021? How often did Charles not win a race when he got pole in 2022? Who was leading the constructor's championship in 2020? All of those questions can be answered using the F1 Standings Explorer web app.

[F1 Standings Explorer Live Site](https://f1-standings-explorer.vercel.app/)

## Technologies Used
F1 Standings Explorer is a full stack web app built using Django, Python, TypScript, Tailwind, and Postgres.

# Features
## Driver's Championship Graphs
F1 Standings Explorer creates visualizations that show how an F1 season played out. Two plots are generated for the Driver's championship. The first is a line graph showing the points total for each driver. Data is rendered by parsing json data pulled from the backend Django API. The web app uses caching so repeated queries are quick. We cache with the TanStack Query hook and on the server using Django's cache middleware.

A driver's position table summary is also generated. This data is rendered using the same data that renders the line-graphs. Both are updated when a user selects filtering options. When viewing the constructor's championship, both data visualizations are re-rendered.

## Data Filtering Options
F1 Standings Explorer provides users the option to select different seasons of F1, filter for date ranges, and toggle between championships. Plots are regenerated using the filtered data.

## Constructor's Championship
Users can toggle to see the Constructor's Championship. The linegraph and positions table update so we can view how each team performed through the year. User's can filter for date ranges and select different seasons just like the WDC graphs.
