function loadPageCreator () {
  var parent,pageType,pageName,createButton,collectionName,newUri,data;
  // TODO: change me to get the collection name based on your current location
  collectionName = 'kanes';

  pageType = $('.fl-creator__page_type_list_select').val().trim();
  createButton = $('.fl-panel--creator__nav__create');
  createButton.one('click',function(){
    pageData = pageTypeData(pageType);
    parent = $('.fl-creator__parent').val().trim();
    pageName = '/'+ $('.fl-creator__new_name').val().trim();
    pageData.metaData['name'] = pageName;
    console.log(parent);

    newUri = makeUrl(parent,pageTypeData(pageType).uriSection,pageName);
    pageData.metaData['uri'] = newUri;
    console.log(newUri);

    $.ajax({
      url: "/zebedee/content/" + collectionName + "?uri=" + newUri + "/data.json",
      dataType: 'json',
      crossDomain: true,
      type: 'POST',
      data: pageData.metaData,
      headers: {
        "X-Florence-Token":accessToken()
      },
      success: function (message) {
          console.log("Updating completed" + message);
          alert("page created at "+newUri)
      },
      error: function (error) {
          console.log(error);
      }
    });
  })
}

function pageTypeData(pageType){

  if (pageType =="bulletin"){
    return {
      type: pageType,
      uriSection: "/bulletins",
      // metadata is currently a just a copy of an existing page's data, this ensures its metadata is valid.
      metaData:  {
        "nextRelease": "21 November 2014",
        "contact": {
          "name": "Robert Doody",
          "email": "ios.enquiries@ons.gsi.gov.uk"
        },
        "lede": "Producer Price Inflation (PPI) measures the price changes of goods bought and sold by UK manufacturers this month compared to the same month a year ago. PPI provides a key measure of inflation alongside other indicators such as the Consumer Prices Index (CPI) and Services Producer Price Index (SPPI).PPI is split into two components: output price inflation and input price inflation. The input price indices capture changes in the cost of the material and fuel inputs that producers face whereas the output price indices capture the changing prices of goods sold by producers.This article looks at the trends in both producer price indices since 2000 and which components contribute most towards changes in each price index in recent years.",
        "more": "Annual output and input price changes follow similar trends, but with the latter tending to have higher price growth1. In Figure 1, trends in producer price inflation can be split into three distinct periods: 2000 to 2005, 2005 to 2012 and 2012 to June 2014.  Both indices experience greater variability within the second period of 2005 to 2012 than compared with the first and third period. From 2005 to 2012 the average growth rate was 2.9% for output price inflation and 8.1% for input price inflation.  The largest peaks and troughs experienced for both indices throughout the time series shown below occurred in the second period of 2005 to 2012. Output price inflation rose to 8.9% in July 2008 while input price inflation rose to 34.8% in June 2008 and both fell to their lowest rates in July 2009: output price inflation falling by 1.6% and input price inflation falling by 14.8%.",
        "sections": [
        ],
        "accordion": [
          {
            "title": "Background notes and methodology",
            "markdown": "Forthcoming changes\n\nTo allow sufficient time to prepare for the major changes in Blue Book 2014, ONS has decided to change the approach to the publication of the Second Estimate of GDP for Q2 2014. This estimate, due to be released on 15 August 2014, will be based entirely on output data. This will supplement the Preliminary Estimate of GDP for Q2 2014 released on 25 July 2014, by replacing the forecast data for the third month of the quarter for the Index of Production (IoP), the Index of Services (IoS) and the monthly construction output survey with actual data. There will be no published information on the income or expenditure components for Q2 2014 until the Quarterly National Accounts (QNA), which is due to be released on 30 September 2014. This will incorporate major changes to the National Accounts - more details are given in the article \u0027Latest Developments to National Accounts\u0027 published on the ONS website.\n\nBlue Book 2014 will itself be published on 31 October 2014.\n\nWhat do you think?\n\nAs a user of our statistics we would welcome your feedback on this publication. If you would like to get in touch please contact us via email: ios.enquiries@ons.gsi.gov.uk.\n\nPreliminary Estimate of GDP\n\nThe preliminary estimate of GDP is produced using the output approach to measuring GDP and is published less than four weeks after the end of the quarter to which it relates. At this stage the data content of this estimate is around 44% of the total required for the final output based estimate. Data content is higher for the first two months of the quarter compared with the third month which takes account of early returns to the monthly business survey of 44,000 businesses (there is typically a response rate of between 30-50% at this point in time). The estimate is therefore subject to revisions as more data become available, but between the preliminary and third estimates of GDP, revisions are typically small (around 0.1 to 0.2 percentage points), with the frequency of upward and downward revisions broadly equal.\n\nContinuous Improvement of GDP: sources, methods and communication\n\nAn article providing an overview of current and planned continuous improvement work in relation to producing estimates of quarterly and annual GDP can be found in the Guidance and Methodology area.\n\nOn 31 May 2013, ONS launched a public consultation on a five year work plan (2013/2014 – 2017/2018) for National Accounts and other outputs that have a close relationship. The finalised National Accounts and Related Statistics Work Plan (231.4 Kb Pdf) has since been published on the ONS website.\n\nSpecial Events\n\nONS maintains a list of candidate special events in the Special Events Calendar. As explained in ONS’s ONS Special Events policy, it is not possible to separate the effects of special events from other changes in the series. While ONS has not classified the 2014 FIFA World Cup as a statistical special event, the Retail Sales, May 2014 release highlighted that feedback from some retailers had suggested sales increased in May 2014 due to the build-up of it. There is no evidence to suggest that this event had an effect on other industries in May 2014, and early responses used to forecast the June 2014 estimates in this release indicate that the 2014 FIFA World Cup did not have a significant impact on GDP.\n\nUnderstanding the data\n\nShort guide to GDP \n\nGross domestic product (GDP) is an integral part of the UK national accounts and provides a measure of the total economic activity in the UK. GDP is often referred to as one of the main \u0027summary indicators\u0027 of economic activity and references to \u0027growth in the economy\u0027 invariably refer to the growth in GDP during the latest quarter.\n\nIn the UK three different but equivalent approaches are used in the estimation of GDP:\n\nGDP from the output or production approach - GDP(O) measures the sum of the value added created through the production of goods and services within the economy (our production or output as an economy). This approach provides the first estimate of GDP and can be used to show how much different industries (for example, services) contribute within the economy.\n\nGDP from the income approach - GDP(I) measures the total income generated by the production of goods and services within the economy. The figures breakdown income into, for example, income earned by companies (corporations), employees and the self employed.\n\nGDP from the expenditure approach - GDP(E) measures the total expenditures on all finished goods and services produced within the economy.\n\nHow ONS statistics explain the economy\n\nThe Index of Services is mentioned in a video summary which highlights 14 ways ONS statistics help you understand the economy. The video summary, along with an interactive version of the video, was released on the ONS website on 27 June 2014 alongside the Quarterly National Accounts for Q1 2014.\n\nShort guide to National Accounts\n\nThe national accounts provide an integrated description of all economic activity within the economic territory of the UK, including activity involving both domestic units (i.e. individuals and institutions resident in the UK) and external units (those resident in other countries). In addition to being comprehensive, the accounts are fully integrated and internally consistent. More information can be found in UK national accounts: a short guide.\n\nInterpreting the data\n\nFigures for the most recent quarter are provisional and subject to revision in light of (a) late responses to surveys and administrative sources, (b) forecasts being replaced by actual data and (c) revisions to seasonal adjustment factors which are re-estimated every quarter and reviewed annually.\n\nData for the retail industry are broadly comparable with the Retail Sales Index published on 19 June 2014. However, the two series operate under different revisions policies meaning there can be timing differences in the updating of the two series. Also, adjustments to the data within the IoS release are sometimes made at the time of the Blue Book to improve the coherence of the three approaches to measuring GDP. Therefore, inconsistencies between the two series are not unusual but tend to be small. There are also conceptual and coverage differences between retail sales and retail output which can lead to apparent inconsistencies.\n\nData for June were unavailable at the time of finalising figures for the preliminary estimate of GDP. In line with other industries in GDP a forecast was made based on responses that were available for June for the retail industry. The resultant quarterly growth used within the preliminary estimate of GDP for retail was only slightly stronger than that published in the Retail Sales Index published on 24 July 2014. The impact on GDP growth from using a June forecast for retail was negligible (less than 0.01 percentage points).\n\nDefinitions and explanations\n\nDefinitions found within the main statistical bulletin are listed here:\n\nIndex number \nAn index number is a number which indicates the change in magnitude relative to the magnitude at a specified point, the latter usually taken as 100. For example, the level of GDP for Q2 2014 is given in Table 1 as 106.0. This means that GDP was 6.0% higher than the average in the reference period, which is currently 2010.\n\nSeasonal adjustment \nThe index numbers in this statistical bulletin are all seasonally adjusted. This aids interpretation by removing annually recurring fluctuations, for example, due to holidays or other regular seasonal patterns. Unadjusted data are also available.\n\nSeasonal adjustment removes regular variation from a time series. Regular variation includes effects due to month lengths, different activity near particular events such as shopping activity before Christmas, and regular holidays such as the May bank holiday.\n\nSome features of the calendar are not regular each year, but are predictable if we have enough data - for example the number of certain days of the week in a month may have an effect, or the impact of the timing of Easter. As Easter changes between March and April we can estimate its effect on time series and allocate it between March and April depending on where Easter falls. Estimates of the effect of the day of the week and Easter are used respectively to make trading day and Easter adjustments prior to seasonal adjustment.\n\nDeflation \nIt is standard practice to present many economic statistics in terms of ‘constant prices’. This means that changes or growth, are not affected by changes in price. The process of removing price changes is known as deflation and the resulting series is often described as volume (as opposed to value). The index numbers in this bulletin are volume measures. \n\nChained volume \nThe indices in this bulletin are ‘chained volume’ measures. This means that successive volume estimates are linked (or chained) together. The process of annual chain-linking was introduced in 2003. More information on chain-linking can be found in the Tuke and Reed (2001) (92.8 Kb Pdf) article, and a paper on chain-linking weights in the output approach to measuring GDP can be found on the Methods and Sources page.\n\nGross Value Added Industry Weights Dataset \nAn update to the annual weights used within the output approach of GDP has been included in our dataset. These weights have been used since the Quarterly National Accounts, published on 27 June 2013 and are consistent with the data used in the Blue Book 2013 dataset, published on 31 July 2013. All weights are given in parts per thousand.\n\nSample sizes and data content \nThis is the first estimate of GDP, based on preliminary information for the quarter. Although based on a significant number of returns from businesses, there is still a lot of information to come in, particularly for June.\n\nThe amount of data available at this stage is about 44% of the total data that will be available in one year’s time. The estimates in this release are, however, based on a large amount of information returned by businesses across the whole of the economy. Information on activity (more specifically, turnover or sales) is available from about 44,000 businesses for each of the first two months of the quarter and from about 20,000 businesses for the third month. In addition, the ONS collects price information on nearly 200,000 individual products each month from around 30,000 businesses. This information is used to remove the effect of price changes from the estimates.\n\nQuality\n\nBasic Quality Information \nAll estimates, by definition, are subject to statistical ‘error’ but in this context the word refers to the uncertainty inherent in any process or calculation that uses sampling, estimation or modelling. Most revisions reflect either the adoption of new statistical techniques, or the incorporation of new information, which allows the statistical error of previous statements to be reduced. Only rarely are there avoidable ‘errors’ such as human or system failures, and such mistakes are made quite clear when they do occur.\n\nExpectations of accuracy and reliability in early estimates are often too high. Revisions are an inevitable consequence of the trade off between timeliness and accuracy. Early estimates are based on incomplete data.\n\nQuality and methodology report \nA quality and methodology report for estimates of Gross Domestic Product is provided on the ONS website.\n\nThis report describes, in detail the intended uses of the statistics presented in this publication, their general quality and the methods used to produce them.\n\nNational Accounts revisions policy\n\nIn accordance with the National Accounts revision policy (27.8 Kb Pdf) , there are no periods open for revision in this release. More information on revisions in the output approach to measuring GDP can be found on the Methods and Sources page.\n\nThis release includes information available up to 17 July 2014.\n\nRevisions Triangles\n\nSpreadsheets giving revisions triangles (real time databases) of estimates from 1992 to date are available to download. They can be found under the section Revisions triangles for gross value added at basic prices, chained volume measure.\n\nThe revisions triangles for the components of GDP have been temporarily removed following the move to the new Standard Industrial Classification (SIC2007) in October 2011. The revisions triangles for total GDP are still available and the services industry analysis is separately available on a monthly basis via the Index of Services dataset.\n\nRevisions to data provide one indication of the reliability of key indicators. Tables 12 and 13 show summary information on the size and direction of the revisions which have been made to data covering a five year period. A statistical test has been applied to the average revision to find out if it is statistically significantly different from zero. The result of the test is that the average revision is not statistically different from zero.\n\nFollowing ONS\n\nYou can follow ONS on Twitter and Facebook, and view the latest podcasts on YouTube\n\nPublication Policy\n\nDetails of the policy governing the release of new data are available from the press office. Also available is a Pre release Access List of those given pre-publication access to the contents of this release:\n\nAccessing data\n\nThe data presented in the tables of this statistical bulletin are also available to download from the data section of this publication. A completed run of data is available as a time series dataset on the ONS website.\n\nCode of Practice for Official Statistics\n\nNational Statistics are produced to high professional standards set out in the Code of Practice for Official Statistics. They undergo regular quality assurance reviews to ensure that they meet customer needs. They are produced free from any political interference.\n\nCode of Practice\n\nThe UK Statistics Authority has designated these statistics as National Statistics, in accordance with the Statistics and Registration Service Act 2007 and signifying compliance with the Code of Practice for Official Statistics.\n\nDesignation can be broadly interpreted to mean that the statistics:\n\n- meet identified user needs;\n- are well explained and readily accessible;\n- are produced according to sound methods; and\n- are managed impartially and objectively in the public interest.\n\nOnce statistics have been designated as National Statistics it is a statutory requirement that the Code of Practice shall continue to be observed."
          },
          {
            "title": "References",
            "markdown": ""
          },
          {
            "title": "Footnotes",
            "markdown": ""
          }
        ],
        "headline1": "Change in gross domestic product (GDP) is the main indicator of economic growth. GDP increased by 0.8% in Q2 2014, the second consecutive quarter on quarter increase of 0.8%.",
        "headline2": "GDP was 3.1% higher in Q2 2014 compared with the same quarter a year ago.",
        "headline3": "In Q2 2014 GDP was estimated to be 0.2% above the peak in Q1 2008. From peak to trough in 2009, the economy shrank by 7.2%.",
        "summary": "Preliminary estimate for Gross Domestic Product (GDP) containing constant price Gross Value Added (GVA) data for the UK. Data is available split by industrial sector.",
        "relatedBulletins": [],
        "title": "GDP Preliminary Estimate Q3 2014",
        "releaseDate": "19 August 2014",
        "type": "bulletin",
        "name": "GDP Preliminary Estimate Q3 2014",
        "uri": "/economy/grossdomesticproductgdp/bulletins/gdppreliminaryestimateq32014",
        "fileName": "gdppreliminaryestimateq32014",
        "breadcrumb": [
          {
            "index": 0,
            "type": "home",
            "name": "Economy",
            "fileName": "economy"
          },
          {
            "index": 0,
            "type": "home",
            "name": "Gross Domestic Product (GDP)",
            "fileName": "grossdomesticproductgdp",
            "breadcrumb": []
          }
        ]
      }
    };
  }
  else {
    alert('unsupported page type');
  }
}

function makeUrl(args) {
  var accumulator;
  accumulator = [];
  for(var i=0; i < arguments.length; i++){
    accumulator =  accumulator.concat(arguments[i]
                              .split('/')
                              .filter(function(argument){return argument!= ""}));
  }
  console.log(accumulator);
  return accumulator.join('/');
}
