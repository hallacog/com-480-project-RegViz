# Project of Data Visualization (COM-480)

| Student's name | SCIPER |
| -------------- | ------ |
| Selim Hallacoglu | 345132 |

[Milestone 1](#milestone-1) • [Milestone 2](#milestone-2) • [Milestone 3](#milestone-3)

## Milestone 1 (20th March, 5pm)

**10% of the final grade**

This is a preliminary milestone to let you set up goals for your final project and assess the feasibility of your ideas.
Please, fill the following sections about your project.

*(max. 2000 characters per section)*

### Dataset

> Find a dataset (or multiple) that you will explore. Assess the quality of the data it contains and how much preprocessing / data-cleaning it will require before tackling visualization. We recommend using a standard dataset as this course is not about scraping nor data processing.
>
> Hint: some good pointers for finding quality publicly available datasets ([Google dataset search](https://datasetsearch.research.google.com/), [Kaggle](https://www.kaggle.com/datasets), [OpenSwissData](https://opendata.swiss/en/), [SNAP](https://snap.stanford.edu/data/) and [FiveThirtyEight](https://data.fivethirtyeight.com/)).

The dataset is the ["Gross value added (GVA) at basic prices by NUTS 3 region"](https://ec.europa.eu/eurostat/databrowser/view/nama_10r_3gva__custom_20650544/default/table?page=time:2024) by Eurostat, which contains the GVA of 10 different economic sectors in NUTS 3 regions (for example, Switzerland is a NUTS 1 region, Gèneve + Vaud + Valais is a NUTS 2 region and Vaud is a NUTS 3 region). As the data is from a trusted and high quality source like Eurostat, it is of high quality. The only preprocessing necessary will be that some regions do not have a data for certain years, and so they will have to be handled differently.

### Problematic

> Frame the general topic of your visualization and the main axis that you want to develop.
> - What am I trying to show with my visualization?
> - Think of an overview for the project, your motivation, and the target audience.

Economic policies of nations are usually applied on the entire country and are based on the aggregate data of the regions in that country. However, there is a great deal of diversity between the economies of regions withing a state. Therefore, basing policies soley on nation-level data may be unproductive, sometimes even destructive for regional economies.

This visualisation aims to show the differences of regional economies within countries of Europe. This will be done by creating an "identity card" for regional economies, which will be a radar pie chart for each region, with the variables being the GVA of the 10 economic sectors in the dataset. This will allow the viwer to compare regional economies by simply seeing the radial pie charts of multiple regional economies side by side, by clicking on the regions on a map. This will also allow to see whether NUTS 2 regions are actually a good indicator for the similarity of economic activities. So, at the end, this projects target audience are both policymakers, in order for them to better understand the details of their countries economies, but also regular people who wonder what is the sector that, for example, contributes the most to their regional economies.

### Exploratory Data Analysis

> Pre-processing of the data set you chose
> - Show some basic statistics and get insights about the data

The exploratory data analysis is already done by Eurostat [here](https://ec.europa.eu/eurostat/databrowser/view/nama_10r_3gva__custom_20650544/default/map?lang=en&page=time:2024) by showing the GVA of each economic sector in each region seperately on a map.

### Related work

> - What others have already done with the data?
> - Why is your approach original?
> - What source of inspiration do you take? Visualizations that you found on other websites or magazines (might be unrelated to your data).
> - In case you are using a dataset that you have already explored in another context (ML or ADA course, semester project...), you are required to share the report of that work to outline the differences with the submission for this class.

As written before, Eurostat has already put all the data on a map, albeit seperately. The originality of this approach is that it will permit viewers to compare all of the sectors' GVA in a region with a single visualisation (through the "identity card" radar pie chart), instead of having to change sectors manually for the map to change. This will also allow for the comparaison of different regions economic sectors through the radar pie chart in a single look, contrary to the Eurostat map. 

## Milestone 2 (17th April, 5pm)

**10% of the final grade**


## Milestone 3 (29th May, 5pm)

**80% of the final grade**


## Late policy

- < 24h: 80% of the grade for the milestone
- < 48h: 70% of the grade for the milestone

