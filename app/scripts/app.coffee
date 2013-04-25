define "prores_fu/view/Month", ['jquery', 'xdate'], ($) ->

    month = class Month
        constructor: (day= new Date) ->
            day = new XDate(day)
            @year = day.getYear() + 1900
            @month = day.getMonth()
            @firstDay = new XDate(@year, @month)
            @lastDay = new XDate(@year, @month + 1).addDays(-1)

            @weeks = []
            for date in [@firstDay.getDate()..@lastDay.getDate()]
                kw = (new XDate(@year, @month, date)).getWeek()
                @weeks.push(kw) if @weeks.indexOf(kw) is -1

            day = new XDate(@firstDay)
            count = 1
            count++ while day.addDays(1).getWeek() is @weeks[0]
            @weeks.shift() if count < 4

            day = new XDate(@lastDay)
            count = 1
            count++ while day.addDays(-1).getWeek() is @weeks[@weeks.length-1]
            @weeks.pop() if count < 4

            @name = ['january','februar','march','april','may','june','july','august','september','october','november','december'][@firstDay.getMonth()]
            @shortName = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'][@firstDay.getMonth()]

        asHtml: ->
            table = $("<table>").addClass("pmfu-timeline-monthly").attr("data-behavior", "pmfu-month")

            tr_month = $("<tr>").addClass "pmfu-month"
            tr_month.append($("<th>").attr("colspan", @weeks.length+"").append(@displayName()))
            table.append tr_month

            current_kw = Month.currentWeek()

            tr_kw = $("<tr>").addClass "pmfu-kw"
            for week in @weeks
                if week is current_kw
                    tr_kw.append("<th class='pmfu-current-kw'>#{week}</th>")
                else
                    tr_kw.append("<th>#{week}</th>")
            table.append tr_kw

            tr_kw_notes = $("<tr>").addClass "pmfu-kw-notes"
            for week in @weeks
                tr_kw_notes.append("<th class='pmfu-kw-notes'></th>")
            table.append tr_kw_notes

            randomNumber = (max, probabilityToBeBlank = 0.25) ->
                n = Math.round(Math.random()*max * 10) / 10.0
                n = '' if Math.random() < probabilityToBeBlank
                return n

            tr_sum_hours = $("<tr>").addClass "pmfu-summary-hours"
            for week in @weeks
                n = randomNumber 7.3
                if n <= 5.0
                    if week is current_kw
                        tr_sum_hours.append("<th class='pmfu-current-kw'>#{n}</th>")
                    else
                        tr_sum_hours.append("<th>#{n}</th>")
                else
                    tr_sum_hours.append("<th class='pmfu-overbooked'>#{n}</th>")
            table.append tr_sum_hours

            addRandomData = =>
                tr_hours = $("<tr>")
                for week in @weeks
                    n = randomNumber 5.0, 0.5
                    if week is current_kw
                        tr_hours.append("<td class='pmfu-current-kw'>#{n}</td>")
                    else
                        tr_hours.append("<td>#{n}</td>")
                table.append tr_hours

            addRandomData()
            addRandomData()
            addRandomData()
            addRandomData()
            addRandomData()
            addRandomData()
            addRandomData()

            return table

        displayName: ->
            display_name =
                jan: 'Januar'
                feb: 'Februar'
                mar: 'M&auml;rz'
                apr: 'April'
                may: 'Mai'
                jun: 'Juni'
                jul: 'July'
                aug: 'August'
                sep: 'September'
                oct: 'Oktober'
                nov: 'November'
                dec: 'Dezember'
            if @shortName is 'dec' or @shortName is 'jan'
                "#{display_name[@shortName]}'#{@year.toString().slice 2}"
            else
                display_name[@shortName]


    month.fromToday = -> new Month

    month.fromName = (nameOfMonth, year= (new XDate).getYear()+1900) ->
        map =
            jan: 0
            january: 0
            feb: 1
            februar: 1
            mar: 2
            march: 2
            apr: 3
            april: 3
            may: 4
            jun: 5
            june: 5
            jul: 6
            july: 6
            aug: 7
            august: 7
            sep: 8
            september: 8
            oct: 9
            october: 9
            nov: 10
            november: 10
            dec: 11
            december: 11
        new Month(new XDate(year, map[nameOfMonth.toLowerCase()]))

    month.currentWeek = -> (new XDate).getWeek()



    return month



define "prores_fu/view/Timeline", ['xdate'], ->

    template_select = """
        <div class='btn-group'>
            <a class='btn dropdown-toggle' data-toggle='dropdown' href='#'><i class='icon-user'></i> Auswahl<span class='caret'></span></a>
            <ul class='dropdown-menu'>
                <li><a href='#'>foo</a></li>
                <li><a href='#'>bar</a></li>
                <li><a href='#'>plah!</a></li>
            </ul>
        </div>
    """

    timeline = class Timeline

        constructor: (container, sidebarWidthPx) ->
            @root = if typeof container is 'string' then $(container) else container
            unless typeof sidebarWidthPx is 'integer'
                sidebarWidthPx = Math.round(@root.innerWidth() * 0.25)

            @container = $("<div class='pmfu-timeline-container' />")
            @root.append @container

            @scrollArea = $("<div class='pmfu-timeline-scrollarea' />")
            @scrollArea.css left: "#{sidebarWidthPx}px"
            @container.append @scrollArea

            @sidebar = $("<div class='pmfu-timeline-sidebar' />")
            @sidebar.css width: "#{sidebarWidthPx}px"
            @container.append @sidebar

            @sidebarHeader = $("<div class='pmfu-timeline-sidebar-header' />")
            @sidebar.append @sidebarHeader
            @sidebarHeader.html(template_select)

            @timeline = $("<div class='pmfu-timeline' />")
            @scrollArea.append @timeline

            @shadow = $("<div style='display:none' class='pmfu-timeline-shadow' />")
            @shadow.css left: "#{sidebarWidthPx}px"
            @container.append @shadow

            shadow_func = do (shadow= @shadow) ->
                return (e) ->
                    if $(e.target).scrollLeft() > 0
                        if shadow_func.hidden
                            shadow.show()
                            shadow_func.hidden = no
                    else
                        unless shadow_func.hidden
                            shadow.hide()
                            shadow_func.hidden = yes

            shadow_func.hidden = yes
            @scrollArea.scroll shadow_func

            @marginBottom = 20

            @updateView()


        updateView: ->
            width = 0
            @timeline.children('[data-behavior~=pmfu-month]').each (n, el) ->
                width += $(el).width() + 10
            height = @timeline.children('[data-behavior~=pmfu-month]:first').outerHeight()
            @timeline.width(width+'px')
            @timeline.height(height+'px')
            @shadow.height "#{height}px"

        addMonth: (month) ->
            @timeline.append month.asHtml()
            @updateView()

        addSection: (title, rows) ->
            section = $("<ol class='pmfu-timeline-sidebar-sections'>")
            section.append "<li class='pmfu-timeline-sidebar-section'><p><nobr>#{title}</nobr></p></li>"
            for row in rows
                section.append "<li><p>#{row}</p></li>"
            @sidebar.append section
            @root.height(@sidebar.children("ol:first").outerHeight(true) + @marginBottom)
            return


    return timeline



define "app", ['prores_fu/view/Month', 'prores_fu/view/Timeline', 'xdate'], (Month, Timeline) ->

    console.info "Welcome to *prores_fu*"

    window.Month = Month

    jan = new Month.fromName 'jan'
    console.log jan
    feb = new Month.fromName 'feb'
    console.log feb

    oct = new Month.fromName 'oct'
    console.log oct
    nov = new Month.fromName 'nov'
    console.log nov
    dec = new Month.fromName 'December'
    console.log dec

    console.log "fromToday"
    console.log Month.fromToday()

    window.Timeline = Timeline

    timeline = window.tl = new Timeline $("#timeline")

    timeline.addSection "SectionTitle Goes Here lala", ["eins", "zwei", "drei", "vier", "fünf", "sechs", "sieben"]

    timeline.addMonth Month.fromName 'oct'
    timeline.addMonth Month.fromName 'nov'
    timeline.addMonth Month.fromName 'dec'
    timeline.addMonth Month.fromName 'jan', 2013
    timeline.addMonth Month.fromName 'feb', 2013
    timeline.addMonth Month.fromName 'mar', 2013

    Month.currentWeek()

