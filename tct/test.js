async function init() {
    document.getElementById("loadingStorms").innerHTML = "<b><i>LOADING STORM DATA...</i></b>"
    // scrape the ATCF file
    var file = "https://www.nrlmry.navy.mil/tcdat/sectors/atcf_sector_file"
    await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(file)}`)
        .then(response => {
            if (response.ok) return response.json()
            throw new Error('Network response was not ok.')
        })
        .then(ATCF_Data => {
            file = "https://www.nrlmry.navy.mil/tcdat/sectors/interp_sector_file"
            fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(file)}`)
                .then(response => {
                    if (response.ok) return response.json()
                    throw new Error('Network response was not ok.')
                })
                .then(INTERP_Data => {
                    numberOfStorms(ATCF_Data, INTERP_Data)
                })
        });
}

function numberOfStorms(ATCF_Data, INTERP_Data) {
    var ATCFSplit = new Array()
    var INTERPSplit = new Array()
    var selectOptions = ""
    var ATCFLine = ATCF_Data.contents.split("\n")
    var INTERPLine = INTERP_Data.contents.split("\n")
    var copyINTERPLine = INTERP_Data.contents.split("\n")
    var filterCounter = 0

    // if ATCF data is not blank
    if (ATCFLine[0] != "") {
        // Filter ATCF file
        for (var i = 0; i < ATCFLine.length; i++) {
            var ATCFFilterSplitExtracted = new Array()
            var ATCFFilterSplit = ATCFLine[i].toLowerCase().split("")
            for (var a = 0; a < 3; a++) {
                // Extracts first 3 characters of ATCF
                ATCFFilterSplitExtracted.push(ATCFFilterSplit[a])
            }

            // Filter INTERP file
            for (var j = 0; j < copyINTERPLine.length; j++) {
                var INTERPFilterSplitExtracted = new Array()
                var INTERPFilterSplit = copyINTERPLine[j].toLowerCase().split("")

                // NIO/SHEM/SATL
                var specialStormsSplit = copyINTERPLine[j].toLowerCase().split(" ")
                specialStormsSplit = specialStormsSplit[6]

                for (var b = 0; b < 4; b++) {
                    // Extracts first 3 SIGNIFICANT characters of the INTERP
                    if (b == 1) {
                        b += 1
                    }
                    INTERPFilterSplitExtracted.push(INTERPFilterSplit[b])
                }
                if (specialStormsSplit == "a" || specialStormsSplit == "b" || specialStormsSplit == "s" || specialStormsSplit == "p" || specialStormsSplit == "q") {
                    INTERPFilterSplitExtracted[0] = specialStormsSplit
                }

                for (var aa = 1, ab = 0; aa < 3; aa++, ab++) {
                    // Check if the same array position is the same storm
                    if (ATCFFilterSplitExtracted[ab] == INTERPFilterSplitExtracted[aa]) {
                        filterCounter++
                    }
                    // If none of the conditions fit, escape the loop
                    else break
                    // If verified checking, escape the loop
                    if (filterCounter == 3) {
                        filterCounter = 0
                        INTERPLine[i] = copyINTERPLine[j]
                        break
                    }
                    // INTERP phase shift
                    if (aa == 2) {
                        aa = -1
                    }
                }
            }
        }

        for (var i = 0; i < ATCFLine.length - 1; i++) {
            ATCFSplit[i] = ATCFLine[i].split(" ")
            INTERPSplit[i] = INTERPLine[i].split(" ")
        }
        for (var i = 0; i < ATCFSplit.length; i++) {
            selectOptions += `
            <option id="option${i}" value="${ATCFSplit[i][0]}">${ATCFSplit[i][0] + " " + ATCFSplit[i][1]}</option>
        `
        }
        document.getElementById("stormSelector").innerHTML += selectOptions
        displayInfo(ATCFSplit, INTERPSplit)
    } else {
        document.getElementById("loadingStorms").innerHTML = ""
        document.getElementById("noStorms").innerHTML = "<i>The ATCF may not be updating or there are currently no systems active.</i>"
    }
}

function redirectToStorm() {
    // Redirect to user specified storm
    var chosenStorm = document.getElementById("stormSelector").value
    window.location.assign(window.location.pathname + "#" + chosenStorm)
}

function displayInfo(ATCFSplit, INTERPSplit) {
    var ATCFSplit = ATCFSplit

    for (var i = 0; i < ATCFSplit.length; i++) {
        var display = ""

        // Format numerical month to proper string
        var monthChecker = ATCFSplit[i][2].substr(2)
        monthChecker = monthChecker.substr(0, monthChecker.length - 2)
        switch (monthChecker) {
            case "01": { var month = "January" }
                break
            case "02": { var month = "February" }
                break
            case "03": { var month = "March" }
                break
            case "04": { var month = "April" }
                break
            case "05": { var month = "May" }
                break
            case "06": { var month = "June" }
                break
            case "07": { var month = "July" }
                break
            case "08": { var month = "August" }
                break
            case "09": { var month = "September" }
                break
            case "10": { var month = "October" }
                break
            case "11": { var month = "November" }
                break
            case "12": { var month = "December" }
                break
        }

        // Format the latitude more exactly
        var latitude = ATCFSplit[i][4]
        var latitudeRef = latitude.substr(latitude.length - 1)
        latitude = latitude.substr(0, latitude.length - 1) + "Â°" + latitudeRef
        var longitude = ATCFSplit[i][5]
        var longitudeRef = longitude.substr(longitude.length - 1)
        var longitudeCompare = longitude.substr(0, longitude.length - 1)
        longitude = longitude.substr(0, longitude.length - 1) + "Â°" + longitudeRef

        // Provide imperial and metric units
        var imperialKts = (ATCFSplit[i][7] * 1.15078).toFixed(0)
        var metricKts = (ATCFSplit[i][7] * 1.852).toFixed(0)
        var imperialPressure = (ATCFSplit[i][8] / 33.864).toFixed(2)

        // Provide ECMWF model data if possible
        var stormid = ATCFSplit[i][0]
        var stormSuffix = stormid.substr(2)
        switch (stormSuffix) {
            case "L": { var prefix = "AL" }
                break
            case "E": { var prefix = "EP" }
                break
            case "C": { var prefix = "CP" }
                break
            case "W": { var prefix = "WP" }
                break
            case "B": case "A": { var prefix = "IO" }
                break
            default: { var prefix = "SH" }
        }
        stormid = prefix + stormid.substr(0, stormid.length - 1)

        // Provide ideal satellite for storms
        switch (prefix) {
            case "AL": { var satellite = "G16-ABI-FD-BAND13-GRAD" }
                break
            case "EP": case "CP": { var satellite = "G17-ABI-FD-BAND13-GRAD" }
                break
            case "WP": { var satellite = "HIMAWARI-B13-GRAD" }
                break
            case "IO": { var satellite = "globalir-ott" }
                break
            default: {
                var satellite = "globalir-ott"
                if (parseFloat(longitude.substr(0, longitude.length - 2)) >= 90 && parseFloat(longitude.substr(0, longitude.length - 2)) <= 160) {
                    satellite = "HIMAWARI-B13-GRAD"
                }
            }
                break
        }

        // Weathernerds designation
        if (prefix == "IO") {
            prefix = "NI" + stormid.substr(2)
        }
        else if (prefix == "SH") {
            if (parseFloat(longitudeCompare) < 135) {
                prefix = "SI" + stormid.substr(2)
            }
            else {
                prefix = "SP" + stormid.substr(2)
            }
        }
        else { prefix = stormid }

        if (latitudeRef == "S") {
            var latitudeSat = -ATCFSplit[i][4].substr(0, ATCFSplit[i][4].length - 1)
        } else var latitudeSat = ATCFSplit[i][4].substr(0, ATCFSplit[i][4].length - 1)
        if (longitudeRef == "W") {
            var longitudeSat = -ATCFSplit[i][5].substr(0, ATCFSplit[i][5].length - 1)
        } else var longitudeSat = ATCFSplit[i][5].substr(0, ATCFSplit[i][5].length - 1)

        // Format the header more nicely
        var cycloneNature = INTERPSplit[i][7]
        var cyclonePreferredName = ATCFSplit[i][0]

        if (cycloneNature == "DB") {
            // Invest
            var cycloneNaturePost = "Invest"
        }
        else if (cycloneNature == "DB") {
            // Remnant low
            var cycloneNaturePost = "Remnants of"
            var cyclonePreferredName = ATCFSplit[i][1]
        }
        else if (cycloneNature == "EX") {
            // Extratropical Cyclone
            var cycloneNaturePost = "Extratropical Cyclone"
        }
        else if (cycloneNature == "TD") {
            // Tropical Depression
            var cycloneNaturePost = "Tropical Depression"
        }
        else if (cycloneNature == "SD") {
            // Subtropical Depression
            var cycloneNaturePost = "Subtropical Depression"
        }
        else if (cycloneNature == "MD") {
            // Monsoon Depression
            var cycloneNaturePost = "Monsoon Depression"
        }
        else if (cycloneNature == "TS") {
            // Tropical Storm
            var cycloneNaturePost = "Tropical Storm"
            var cyclonePreferredName = ATCFSplit[i][1]
        }
        else if (cycloneNature == "SS") {
            // Subtropical Storm
            var cycloneNaturePost = "Subtropical Storm"
            var cyclonePreferredName = ATCFSplit[i][1]
        }
        else if (cycloneNature == "HU") {
            // Hurricane
            var cycloneNaturePost = "Hurricane"
            var cyclonePreferredName = ATCFSplit[i][1]
        }
        else if (cycloneNature == "MH") {
            // Major Hurricane
            var cycloneNaturePost = "Major Hurricane"
            var cyclonePreferredName = ATCFSplit[i][1]
        }
        else if (latitudeSat < 0 || INTERPSplit[i][6] == "A" || INTERPSplit[i][6] == "B") {
            // Cyclone (SHEM/NIO)
            var cycloneNaturePost = "Tropical Cyclone"
            var cyclonePreferredName = ATCFSplit[i][1]
        }
        else if (cycloneNature == "TY") {
            // Typhoon
            var cycloneNaturePost = "Typhoon"
            var cyclonePreferredName = ATCFSplit[i][1]
        }
        else if (cycloneNature == "ST") {
            // Super Typhoon
            var cycloneNaturePost = "Super Typhoon"
            var cyclonePreferredName = ATCFSplit[i][1]
        }
        else {
            // In case if INTERP file does not work
            var cycloneNaturePost = ATCFSplit[i][0]
            var cyclonePreferredName = ATCFSplit[i][1]
        }

        // display in HTML
        display = `
        <hr id="${ATCFSplit[i][0]}">
        <div>
            <span class="rounded-pill p-2" id="header${i}" style="font-size: 28px; font-weight: 600;">${cycloneNaturePost + " " + cyclonePreferredName}</span><br>
            <p class="mt-2"> - As of ${ATCFSplit[i][3].substr(0, ATCFSplit[i][3].length - 2)}:00 UTC, ${ATCFSplit[i][2].substr(4)} ${month} ${new Date().getFullYear()}:</p>
        </div>
        <div>
            <p>Location: ${latitude}, ${longitude}</p>
            <p>Maximum Winds: ${ATCFSplit[i][7]} kts (${imperialKts} mph; ${metricKts} kph)</p>
            <p>Minimum Central Pressure: ${ATCFSplit[i][8]} mb (${imperialPressure} inHg)</p>
        </div>
        <br>
    <div class="text-center">
        <h3 class="bg-light rounded-pill">Current Satellite Image</h3>
        <a href="./satview?storm_id=${stormid}" target="_blank"><i class="fas fa-satellite"> Microwave Imagery</i></a>
        <div><img id="satelliteImg${i}" src="https://www.ssd.noaa.gov/PS/TROP/floaters/${ATCFSplit[i][0]}/imagery/rbtop-animated.gif" alt="${ATCFSplit[i][0]}-rbtop-animated.gif"></div>
        <br>
        <br>
        <div id="DvorakSegment${i}"></div>
        <h3 class="bg-light rounded-pill">METAR/SYNOP Surface Observations</h3>
        <img src="https://www.tropicaltidbits.com/storminfo/sfcplots/sfcplot_${ATCFSplit[i][0]}_latest.png" alt="${ATCFSplit[i][0]}-sfcplot">
        <br>
        <br>
        <h3 class="bg-light rounded-pill">Model Ensembles and Mean</h3>
        <p class="text-primary">Click to enlarge</p>
        <div class="row">
            <div class="col">
                <p>GEFS Model Ensemble</p>
                <a href="https://www.tropicaltidbits.com/storminfo/${ATCFSplit[i][0]}_gefs_latest.png" target="_blank"><img src="https://www.tropicaltidbits.com/storminfo/${ATCFSplit[i][0]}_gefs_latest.png" alt="${ATCFSplit[i][0]}-gefs" width=480></a>
            </div>
            <div class="col">
                <p>ECMWF Model Ensemble</p>
                <a id="ECMWFLink${i}" href="" target="_blank"></a>
            </div>
        </div>
        <br>
        <div class="row">
            <div class="col">
                <p>CMC Model Ensemble</p>
                <a href="https://www.tropicaltidbits.com/storminfo/${ATCFSplit[i][0]}_geps_latest.png" target="_blank"><img src="https://www.tropicaltidbits.com/storminfo/${ATCFSplit[i][0]}_geps_latest.png" alt="${ATCFSplit[i][0]}-geps" width=480></a>
            </div>
        </div>
    </div>
    `
        document.getElementById("displayStorms").innerHTML += display
        checkSatellite(satellite, latitudeSat, longitudeSat, i)
        console.log(prefix);
        Dvorak(i, ATCFSplit[i][0], prefix)
        // Counter
        var counter = 0
        // Auto initialize date
        var d = new Date()
        var initYear = d.getUTCFullYear()
        var initMonth = d.getUTCMonth()
        var initMonth = initMonth + 1

        var year = initYear
        var month = ""
        var day = ""
        var hours = ""
        // for JTWC graphic production
        if (initMonth < 10) {
            month = '0' + initMonth
        }
        else {
            month = initMonth
        }
        var initDay = d.getUTCDate()
        if (initDay < 10) {
            day = '0' + initDay
        }
        else {
            day = initDay
        }
        var initHours = d.getUTCHours()
        if (initHours >= 0 && initHours < 6) {
            hours = '00'
        }
        else if (initHours >= 6 && initHours < 12) {
            hours = '06'
        }
        else if (initHours >= 12 && initHours < 18) {
            hours = '12'
        }
        else {
            hours = '18'
        }
        ECMWFGraphic(i, prefix, initYear, year, initMonth, month, initDay, day, initHours, hours, counter)

        // color code storms
        var windspeed = parseInt(ATCFSplit[i][7])

        // In case INTERP file do not work
        if (INTERPSplit == null || INTERPSplit == undefined || INTERPSplit == "") {
            // TD
            if (windspeed < 35 && parseInt(ATCFSplit[i][0].substr(0, ATCFSplit[i][0].length - 1)) < 90) {
                document.getElementById(`header${i}`).style.background = "blue"
                document.getElementById(`header${i}`).style.color = "white"
            }
            // INV
            else if (windspeed < 35) {
                document.getElementById(`header${i}`).style.background = "cyan"
                document.getElementById(`header${i}`).style.color = "black"
            }
            // TS
            else if (windspeed >= 35 && windspeed < 65) {
                document.getElementById(`header${i}`).style.background = "green"
                document.getElementById(`header${i}`).style.color = "white"
            }
            // C1
            else if (windspeed >= 65 && windspeed < 85) {
                document.getElementById(`header${i}`).style.background = "yellow"
                document.getElementById(`header${i}`).style.color = "black"
            }
            // C2
            else if (windspeed >= 85 && windspeed < 100) {
                document.getElementById(`header${i}`).style.background = "gold"
                document.getElementById(`header${i}`).style.color = "black"
            }
            // C3
            else if (windspeed >= 100 && windspeed < 115) {
                document.getElementById(`header${i}`).style.background = "orange"
                document.getElementById(`header${i}`).style.color = "white"
            }
            // C4
            else if (windspeed >= 115 && windspeed < 140) {
                document.getElementById(`header${i}`).style.background = "red"
                document.getElementById(`header${i}`).style.color = "white"
            }
            // C5
            else {
                document.getElementById(`header${i}`).style.background = "darkred"
                document.getElementById(`header${i}`).style.color = "white"
            }
        }
        // if INTERP file works
        else {
            // EX/RL
            if (cycloneNature == "EX" || cycloneNature == "RL" || cycloneNature == "LO") {
                document.getElementById(`header${i}`).style.background = "gray"
                document.getElementById(`header${i}`).style.color = "white"
            }
            // SD
            else if (windspeed < 35 && cycloneNature == "SD") {
                document.getElementById(`header${i}`).style.background = "purple"
                document.getElementById(`header${i}`).style.color = "white"
            }
            // TD
            else if (windspeed < 35 && (cycloneNature == "TD" || cycloneNature == "MD")) {
                document.getElementById(`header${i}`).style.background = "blue"
                document.getElementById(`header${i}`).style.color = "white"
            }
            // INV
            else if (windspeed < 35) {
                document.getElementById(`header${i}`).style.background = "cyan"
                document.getElementById(`header${i}`).style.color = "black"
            }
            // SS
            else if (windspeed >= 35 && windspeed < 65 && cycloneNature == "SS") {
                document.getElementById(`header${i}`).style.background = "lightgreen"
                document.getElementById(`header${i}`).style.color = "black"
            }
            // TS
            else if (windspeed >= 35 && windspeed < 65) {
                document.getElementById(`header${i}`).style.background = "green"
                document.getElementById(`header${i}`).style.color = "white"
            }
            // C1
            else if (windspeed >= 65 && windspeed < 85) {
                document.getElementById(`header${i}`).style.background = "yellow"
                document.getElementById(`header${i}`).style.color = "black"
            }
            // C2
            else if (windspeed >= 85 && windspeed < 100) {
                document.getElementById(`header${i}`).style.background = "gold"
                document.getElementById(`header${i}`).style.color = "black"
            }
            // C3
            else if (windspeed >= 100 && windspeed < 115) {
                document.getElementById(`header${i}`).style.background = "orange"
                document.getElementById(`header${i}`).style.color = "white"
            }
            // C4
            else if (windspeed >= 115 && windspeed < 140) {
                document.getElementById(`header${i}`).style.background = "red"
                document.getElementById(`header${i}`).style.color = "white"
            }
            // C5
            else {
                document.getElementById(`header${i}`).style.background = "darkred"
                document.getElementById(`header${i}`).style.color = "white"
            }
        }
    }
    document.getElementById("loadingStorms").innerHTML = ""
}

function checkSatellite(satellite, latitude, longitude, i) {
    document.getElementById(`satelliteImg${i}`).addEventListener("error", fixSatellite)
    function fixSatellite() {
        document.getElementById(`satelliteImg${i}`).src = `https://realearth.ssec.wisc.edu/api/image?products=${satellite}.100&width=720&height=480&client=RealEarth&background=bluemarble&labels=-&center=${latitude},${longitude}&zoom=6&timeproduct=${satellite}&timespan=-18t&animate=true&animationspeed=92.10526315789474`
    }
}

function ECMWFGraphic(i, prefix, initYear, year, initMonth, month, initDay, day, initHours, hours, counter) {
    document.getElementById(`ECMWFLink${i}`).innerHTML = `<img id="errorECMWF${i}" src="https://www.weathernerds.org/tc_guidance/images/${prefix}_${year}${month}${day}${hours}_ECENS_large.png" alt="${prefix}_${year}${month}${day}${hours}-ECENS" width=480>`
    var ECMWF = `https://www.weathernerds.org/tc_guidance/images/${prefix}_${year}${month}${day}${hours}_ECENS_large.png`
    document.getElementById(`ECMWFLink${i}`).href = `https://www.weathernerds.org/tc_guidance/images/${prefix}_${year}${month}${day}${hours}_ECENS_large.png`
    buffer(ECMWF, i)

    async function buffer(ECMWF, i) {
        // scrape the ECMWF file
        await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(ECMWF)}`)
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                throw new Error('Network response was not ok.')
            })
            .then(data => {
                if (((data.contents).toString()).indexOf("Page") >= 0) {
                    ifError1(i)
                }
            });

        function ifError1(i) {
            var time = cycle()
            if (time != null) {
                document.getElementById(`errorECMWF${i}`).src = `https://www.weathernerds.org/tc_guidance/images/${prefix}_${time[0] + time[1] + time[2] + time[3]}_ECENS_large.png`
                document.getElementById(`errorECMWF${i}`).alt = `${prefix}_${time[0] + time[1] + time[2] + time[3]}-ECENS`
                document.getElementById(`ECMWFLink${i}`).href = `https://www.weathernerds.org/tc_guidance/images/${prefix}_${time[0] + time[1] + time[2] + time[3]}_ECENS_large.png`
                ECMWF = `https://www.weathernerds.org/tc_guidance/images/${prefix}_${time[0] + time[1] + time[2] + time[3]}_ECENS_large.png`
                buffer(ECMWF, i)
            }
        }

        function cycle() {
            if (counter < 5) {
                // Reduce by 6 hours
                hours = initHours - 6
                initHours = initHours - 6

                // if hours is negative
                if (initHours < 1) {
                    // reduce days and compensate for hours
                    day = initDay - 1
                    initDay = initDay - 1
                    hours = initHours + 24
                    initHours = initHours + 24

                    // if days is negative
                    if (initDay < 1) {
                        // reduce month and compensate for days and hours
                        month = initMonth - 1
                        initMonth = initMonth - 1

                        if (initMonth < 1) {
                            // reduce year and compensate for month, day and hours
                            year = initYear - 1
                            initYear = initYear - 1
                            month = initMonth + 12
                            initMonth = initMonth + 12
                            hours = initHours + 24
                            initHours = initHours + 24

                            // format month and day
                            if (initMonth < 10) {
                                month = "0" + initMonth
                            }
                            if (initDay < 10) {
                                day = "0" + initDay
                            }

                            if (initHours >= 0 && initHours < 6) {
                                hours = "00"
                            }
                            else if (initHours >= 6 && initHours < 12) {
                                hours = "06"
                            }
                            else if (initHours >= 12 && initHours < 18) {
                                hours = "12"
                            }
                            else {
                                hours = "18"
                            }
                        }
                        // if month is not negative
                        // 31 day month
                        if ([1, 3, 5, 7, 8, 10, 12].includes(initMonth)) {
                            day = initDay + 31
                            initDay = initDay + 31
                        }
                        // 30 day month
                        else if ([4, 6, 9, 11].includes(initMonth)) {
                            day = initDay + 30
                            initDay = initDay + 30
                        }
                        // 28 day month
                        else if (initMonth == 2) {
                            day = initDay + 28
                            initDay = initDay + 28
                        }
                        // 29 day month
                        else if (initMonth == (2 && (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)))) {
                            day = initDay + 29
                            initDay = initDay + 29
                        }
                        hours = initHours + 24
                        initHours = initHours + 24

                        // format month and day
                        if (initMonth < 10) {
                            month = "0" + initMonth
                        }
                        if (initDay < 10) {
                            day = "0" + initDay
                        }

                        if (initHours >= 0 && initHours < 6) {
                            hours = "00"
                        }
                        else if (initHours >= 6 && initHours < 12) {
                            hours = "06"
                        }
                        else if (initHours >= 12 && initHours < 18) {
                            hours = "12"
                        }
                        else {
                            hours = "18"
                        }
                    }
                    // if days not negative format days
                    if (initDay < 10) {
                        day = "0" + initDay
                    }
                    if (initHours >= 0 && initHours < 6) {
                        hours = "00"
                    }
                    else if (initHours >= 6 && initHours < 12) {
                        hours = "06"
                    }
                    else if (initHours >= 12 && initHours < 18) {
                        hours = "12"
                    }
                    else {
                        hours = "18"
                    }
                }
                // if hours not negative
                else {
                    if (initHours >= 0 && initHours < 6) {
                        hours = "00"
                    }
                    else if (initHours >= 6 && initHours < 12) {
                        hours = "06"
                    }
                    else if (initHours >= 12 && initHours < 18) {
                        hours = "12"
                    }
                    else {
                        hours = "18"
                    }
                }
                counter++
            }
            else {
                return null
            }
            return [year, month, day, hours]
        }
    }
}

function Dvorak(i, stormNo, prefix) {
    // if it is a numbered storm of TD or higher
    if (parseInt(stormNo.substr(0, stormNo.length - 1)) < 90) {
        // ADT
        var ADTDesignator = stormNo + "P"
        document.getElementById(`DvorakSegment${i}`).innerHTML = `
            <div class="row">
        <h3 class="bg-light rounded-pill">Dvorak Satellite Estimates</h3>
            <div class="col">
                <p>CIMSS Advanced Dvorak</p>
                <a id="CIMSSLink${i}" href="http://tropic.ssec.wisc.edu/real-time/adt/${ADTDesignator}.GIF" target="_blank"><img id="CIMSSADT${i}" src="http://tropic.ssec.wisc.edu/real-time/adt/${ADTDesignator}.GIF" alt="${ADTDesignator}-ADTDT" width=480></a>
            </div>
            <div class="col">
                <p>RAMMB Dvorak</p>
                <a id="RAMMBLink${i}" href="" target="_blank"></a>
            </div>
        </div>
        <br>
        <br>
        `

        // RAMMB
        // Counter
        var counter = 0
        // Auto initialize date
        var d = new Date()
        var initYear = d.getUTCFullYear()
        var initMonth = d.getUTCMonth()
        var initMonth = initMonth + 1

        var year = initYear
        var ATCFYear = initYear
        var month = ""
        var day = ""
        var hours = ""
        // for JTWC graphic production
        if (initMonth < 7) {
            ATCFYear + 1
        }
        if (initMonth < 10) {
            month = '0' + initMonth
        }
        else {
            month = initMonth
        }
        var initDay = d.getUTCDate()
        if (initDay < 10) {
            day = '0' + initDay
        }
        else {
            day = initDay
        }
        var initHours = d.getUTCHours()
        if (initHours >= 0 && initHours < 3) {
            hours = "00"
        }
        else if (initHours >= 3 && initHours < 6) {
            hours = "03"
        }
        else if (initHours >= 6 && initHours < 9) {
            hours = "06"
        }
        else if (initHours >= 9 && initHours < 12) {
            hours = "09"
        }
        else if (initHours >= 12 && initHours < 15) {
            hours = "12"
        }
        else if (initHours >= 15 && initHours < 18) {
            hours = "15"
        }
        else if (initHours >= 18 && initHours < 21) {
            hours = "18"
        }
        else {
            hours = "21"
        }

        document.getElementById(`RAMMBLink${i}`).href = `https://rammb-data.cira.colostate.edu/tc_realtime/products/storms/${ATCFYear + prefix.toLowerCase()}/dgtldvor/${ATCFYear + prefix.toLowerCase()}_dgtldvor_${year + month + day + hours}00.gif`
        document.getElementById(`RAMMBLink${i}`).innerHTML = `<img id="RAMMBDT${i}" src="https://rammb-data.cira.colostate.edu/tc_realtime/products/storms/${ATCFYear + prefix.toLowerCase()}/dgtldvor/${ATCFYear + prefix.toLowerCase()}_dgtldvor_${year + month + day + hours}00.gif" width=480>`
        document.getElementById(`RAMMBDT${i}`).addEventListener("error", errorRAMMB)
        function errorRAMMB() {
            var time = cycle()
            document.getElementById(`RAMMBDT${i}`).src = `https://rammb-data.cira.colostate.edu/tc_realtime/products/storms/${ATCFYear + prefix.toLowerCase()}/dgtldvor/${ATCFYear + prefix.toLowerCase()}_dgtldvor_${time[0] + time[1] + time[2] + time[3]}00.gif`
            document.getElementById(`RAMMBLink${i}`).href = `https://rammb-data.cira.colostate.edu/tc_realtime/products/storms/${ATCFYear + prefix.toLowerCase()}/dgtldvor/${ATCFYear + prefix.toLowerCase()}_dgtldvor_${time[0] + time[1] + time[2] + time[3]}00.gif`
            document.getElementById(`RAMMBDT${i}`).alt = `https://rammb-data.cira.colostate.edu/tc_realtime/products/storms/${ATCFYear + prefix.toLowerCase()}/dgtldvor/${ATCFYear + prefix.toLowerCase()}_dgtldvor_${time[0] + time[1] + time[2] + time[3]}00.gif`
            document.getElementById(`RAMMBDT${i}`).addEventListener("error", errorRAMMB)
        }

        function cycle() {
            if (counter < 5) {
                // Reduce by 6 hours
                hours = initHours - 3
                initHours = initHours - 3

                // if hours is negative
                if (initHours < 1) {
                    // reduce days and compensate for hours
                    day = initDay - 1
                    initDay = initDay - 1
                    hours = initHours + 24
                    initHours = initHours + 24

                    // if days is negative
                    if (initDay < 1) {
                        // reduce month and compensate for days and hours
                        month = initMonth - 1
                        initMonth = initMonth - 1

                        if (initMonth < 1) {
                            // reduce year and compensate for month, day and hours
                            year = initYear - 1
                            initYear = initYear - 1
                            month = initMonth + 12
                            initMonth = initMonth + 12
                            hours = initHours + 24
                            initHours = initHours + 24

                            // format month and day
                            if (initMonth < 10) {
                                month = "0" + initMonth
                            }
                            if (initDay < 10) {
                                day = "0" + initDay
                            }

                            if (initHours >= 0 && initHours < 3) {
                                hours = "00"
                            }
                            else if (initHours >= 3 && initHours < 6) {
                                hours = "03"
                            }
                            else if (initHours >= 6 && initHours < 9) {
                                hours = "06"
                            }
                            else if (initHours >= 9 && initHours < 12) {
                                hours = "09"
                            }
                            else if (initHours >= 12 && initHours < 15) {
                                hours = "12"
                            }
                            else if (initHours >= 15 && initHours < 18) {
                                hours = "15"
                            }
                            else if (initHours >= 18 && initHours < 21) {
                                hours = "18"
                            }
                            else {
                                hours = "21"
                            }
                        }
                        // if month is not negative
                        // 31 day month
                        if ([1, 3, 5, 7, 8, 10, 12].includes(initMonth)) {
                            day = initDay + 31
                            initDay = initDay + 31
                        }
                        // 30 day month
                        else if ([4, 6, 9, 11].includes(initMonth)) {
                            day = initDay + 30
                            initDay = initDay + 30
                        }
                        // 28 day month
                        else if (initMonth == 2) {
                            day = initDay + 28
                            initDay = initDay + 28
                        }
                        // 29 day month
                        else if (initMonth == (2 && (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)))) {
                            day = initDay + 29
                            initDay = initDay + 29
                        }
                        hours = initHours + 24
                        initHours = initHours + 24

                        // format month and day
                        if (initMonth < 10) {
                            month = "0" + initMonth
                        }
                        if (initDay < 10) {
                            day = "0" + initDay
                        }

                        if (initHours >= 0 && initHours < 3) {
                            hours = "00"
                        }
                        else if (initHours >= 3 && initHours < 6) {
                            hours = "03"
                        }
                        else if (initHours >= 6 && initHours < 9) {
                            hours = "06"
                        }
                        else if (initHours >= 9 && initHours < 12) {
                            hours = "09"
                        }
                        else if (initHours >= 12 && initHours < 15) {
                            hours = "12"
                        }
                        else if (initHours >= 15 && initHours < 18) {
                            hours = "15"
                        }
                        else if (initHours >= 18 && initHours < 21) {
                            hours = "18"
                        }
                        else {
                            hours = "21"
                        }
                    }
                    // if days not negative format days
                    if (initDay < 10) {
                        day = "0" + initDay
                    }
                    if (initHours >= 0 && initHours < 3) {
                        hours = "00"
                    }
                    else if (initHours >= 3 && initHours < 6) {
                        hours = "03"
                    }
                    else if (initHours >= 6 && initHours < 9) {
                        hours = "06"
                    }
                    else if (initHours >= 9 && initHours < 12) {
                        hours = "09"
                    }
                    else if (initHours >= 12 && initHours < 15) {
                        hours = "12"
                    }
                    else if (initHours >= 15 && initHours < 18) {
                        hours = "15"
                    }
                    else if (initHours >= 18 && initHours < 21) {
                        hours = "18"
                    }
                    else {
                        hours = "21"
                    }
                }
                // if hours not negative
                else {
                    if (initHours >= 0 && initHours < 3) {
                        hours = "00"
                    }
                    else if (initHours >= 3 && initHours < 6) {
                        hours = "03"
                    }
                    else if (initHours >= 6 && initHours < 9) {
                        hours = "06"
                    }
                    else if (initHours >= 9 && initHours < 12) {
                        hours = "09"
                    }
                    else if (initHours >= 12 && initHours < 15) {
                        hours = "12"
                    }
                    else if (initHours >= 15 && initHours < 18) {
                        hours = "15"
                    }
                    else if (initHours >= 18 && initHours < 21) {
                        hours = "18"
                    }
                    else {
                        hours = "21"
                    }
                }
                counter++
            }
            else {
                return null
            }
            return [year, month, day, hours]
        }
    }
    else return
}