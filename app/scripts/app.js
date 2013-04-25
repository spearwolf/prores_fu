(function() {
  define("prores_fu/view/Month", ['jquery', 'xdate'], function($) {
    var Month, month;

    month = Month = (function() {
      function Month(day) {
        var count, date, kw, _i, _ref, _ref1;

        if (day == null) {
          day = new Date;
        }
        day = new XDate(day);
        this.year = day.getYear() + 1900;
        this.month = day.getMonth();
        this.firstDay = new XDate(this.year, this.month);
        this.lastDay = new XDate(this.year, this.month + 1).addDays(-1);
        this.weeks = [];
        for (date = _i = _ref = this.firstDay.getDate(), _ref1 = this.lastDay.getDate(); _ref <= _ref1 ? _i <= _ref1 : _i >= _ref1; date = _ref <= _ref1 ? ++_i : --_i) {
          kw = (new XDate(this.year, this.month, date)).getWeek();
          if (this.weeks.indexOf(kw) === -1) {
            this.weeks.push(kw);
          }
        }
        day = new XDate(this.firstDay);
        count = 1;
        while (day.addDays(1).getWeek() === this.weeks[0]) {
          count++;
        }
        if (count < 4) {
          this.weeks.shift();
        }
        day = new XDate(this.lastDay);
        count = 1;
        while (day.addDays(-1).getWeek() === this.weeks[this.weeks.length - 1]) {
          count++;
        }
        if (count < 4) {
          this.weeks.pop();
        }
        this.name = ['january', 'februar', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'][this.firstDay.getMonth()];
        this.shortName = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'][this.firstDay.getMonth()];
      }

      Month.prototype.asHtml = function() {
        var addRandomData, current_kw, n, randomNumber, table, tr_kw, tr_kw_notes, tr_month, tr_sum_hours, week, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2,
          _this = this;

        table = $("<table>").addClass("pmfu-timeline-monthly").attr("data-behavior", "pmfu-month");
        tr_month = $("<tr>").addClass("pmfu-month");
        tr_month.append($("<th>").attr("colspan", this.weeks.length + "").append(this.displayName()));
        table.append(tr_month);
        current_kw = Month.currentWeek();
        tr_kw = $("<tr>").addClass("pmfu-kw");
        _ref = this.weeks;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          week = _ref[_i];
          if (week === current_kw) {
            tr_kw.append("<th class='pmfu-current-kw'>" + week + "</th>");
          } else {
            tr_kw.append("<th>" + week + "</th>");
          }
        }
        table.append(tr_kw);
        tr_kw_notes = $("<tr>").addClass("pmfu-kw-notes");
        _ref1 = this.weeks;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          week = _ref1[_j];
          tr_kw_notes.append("<th class='pmfu-kw-notes'></th>");
        }
        table.append(tr_kw_notes);
        randomNumber = function(max, probabilityToBeBlank) {
          var n;

          if (probabilityToBeBlank == null) {
            probabilityToBeBlank = 0.25;
          }
          n = Math.round(Math.random() * max * 10) / 10.0;
          if (Math.random() < probabilityToBeBlank) {
            n = '';
          }
          return n;
        };
        tr_sum_hours = $("<tr>").addClass("pmfu-summary-hours");
        _ref2 = this.weeks;
        for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
          week = _ref2[_k];
          n = randomNumber(7.3);
          if (n <= 5.0) {
            if (week === current_kw) {
              tr_sum_hours.append("<th class='pmfu-current-kw'>" + n + "</th>");
            } else {
              tr_sum_hours.append("<th>" + n + "</th>");
            }
          } else {
            tr_sum_hours.append("<th class='pmfu-overbooked'>" + n + "</th>");
          }
        }
        table.append(tr_sum_hours);
        addRandomData = function() {
          var tr_hours, _l, _len3, _ref3;

          tr_hours = $("<tr>");
          _ref3 = _this.weeks;
          for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
            week = _ref3[_l];
            n = randomNumber(5.0, 0.5);
            if (week === current_kw) {
              tr_hours.append("<td class='pmfu-current-kw'>" + n + "</td>");
            } else {
              tr_hours.append("<td>" + n + "</td>");
            }
          }
          return table.append(tr_hours);
        };
        addRandomData();
        addRandomData();
        addRandomData();
        addRandomData();
        addRandomData();
        addRandomData();
        addRandomData();
        return table;
      };

      Month.prototype.displayName = function() {
        var display_name;

        display_name = {
          jan: 'Januar',
          feb: 'Februar',
          mar: 'M&auml;rz',
          apr: 'April',
          may: 'Mai',
          jun: 'Juni',
          jul: 'July',
          aug: 'August',
          sep: 'September',
          oct: 'Oktober',
          nov: 'November',
          dec: 'Dezember'
        };
        if (this.shortName === 'dec' || this.shortName === 'jan') {
          return "" + display_name[this.shortName] + "'" + (this.year.toString().slice(2));
        } else {
          return display_name[this.shortName];
        }
      };

      return Month;

    })();
    month.fromToday = function() {
      return new Month;
    };
    month.fromName = function(nameOfMonth, year) {
      var map;

      if (year == null) {
        year = (new XDate).getYear() + 1900;
      }
      map = {
        jan: 0,
        january: 0,
        feb: 1,
        februar: 1,
        mar: 2,
        march: 2,
        apr: 3,
        april: 3,
        may: 4,
        jun: 5,
        june: 5,
        jul: 6,
        july: 6,
        aug: 7,
        august: 7,
        sep: 8,
        september: 8,
        oct: 9,
        october: 9,
        nov: 10,
        november: 10,
        dec: 11,
        december: 11
      };
      return new Month(new XDate(year, map[nameOfMonth.toLowerCase()]));
    };
    month.currentWeek = function() {
      return (new XDate).getWeek();
    };
    return month;
  });

  define("prores_fu/view/Timeline", ['xdate'], function() {
    var Timeline, template_select, timeline;

    template_select = "<div class='btn-group'>\n    <a class='btn dropdown-toggle' data-toggle='dropdown' href='#'><i class='icon-user'></i> Auswahl<span class='caret'></span></a>\n    <ul class='dropdown-menu'>\n        <li><a href='#'>foo</a></li>\n        <li><a href='#'>bar</a></li>\n        <li><a href='#'>plah!</a></li>\n    </ul>\n</div>";
    timeline = Timeline = (function() {
      function Timeline(container, sidebarWidthPx) {
        var shadow_func;

        this.root = typeof container === 'string' ? $(container) : container;
        if (typeof sidebarWidthPx !== 'integer') {
          sidebarWidthPx = Math.round(this.root.innerWidth() * 0.25);
        }
        this.container = $("<div class='pmfu-timeline-container' />");
        this.root.append(this.container);
        this.scrollArea = $("<div class='pmfu-timeline-scrollarea' />");
        this.scrollArea.css({
          left: "" + sidebarWidthPx + "px"
        });
        this.container.append(this.scrollArea);
        this.sidebar = $("<div class='pmfu-timeline-sidebar' />");
        this.sidebar.css({
          width: "" + sidebarWidthPx + "px"
        });
        this.container.append(this.sidebar);
        this.sidebarHeader = $("<div class='pmfu-timeline-sidebar-header' />");
        this.sidebar.append(this.sidebarHeader);
        this.sidebarHeader.html(template_select);
        this.timeline = $("<div class='pmfu-timeline' />");
        this.scrollArea.append(this.timeline);
        this.shadow = $("<div style='display:none' class='pmfu-timeline-shadow' />");
        this.shadow.css({
          left: "" + sidebarWidthPx + "px"
        });
        this.container.append(this.shadow);
        shadow_func = (function(shadow) {
          return function(e) {
            if ($(e.target).scrollLeft() > 0) {
              if (shadow_func.hidden) {
                shadow.show();
                return shadow_func.hidden = false;
              }
            } else {
              if (!shadow_func.hidden) {
                shadow.hide();
                return shadow_func.hidden = true;
              }
            }
          };
        })(this.shadow);
        shadow_func.hidden = true;
        this.scrollArea.scroll(shadow_func);
        this.marginBottom = 20;
        this.updateView();
      }

      Timeline.prototype.updateView = function() {
        var height, width;

        width = 0;
        this.timeline.children('[data-behavior~=pmfu-month]').each(function(n, el) {
          return width += $(el).width() + 10;
        });
        height = this.timeline.children('[data-behavior~=pmfu-month]:first').outerHeight();
        this.timeline.width(width + 'px');
        this.timeline.height(height + 'px');
        return this.shadow.height("" + height + "px");
      };

      Timeline.prototype.addMonth = function(month) {
        this.timeline.append(month.asHtml());
        return this.updateView();
      };

      Timeline.prototype.addSection = function(title, rows) {
        var row, section, _i, _len;

        section = $("<ol class='pmfu-timeline-sidebar-sections'>");
        section.append("<li class='pmfu-timeline-sidebar-section'><p><nobr>" + title + "</nobr></p></li>");
        for (_i = 0, _len = rows.length; _i < _len; _i++) {
          row = rows[_i];
          section.append("<li><p>" + row + "</p></li>");
        }
        this.sidebar.append(section);
        this.root.height(this.sidebar.children("ol:first").outerHeight(true) + this.marginBottom);
      };

      return Timeline;

    })();
    return timeline;
  });

  define("app", ['prores_fu/view/Month', 'prores_fu/view/Timeline', 'xdate'], function(Month, Timeline) {
    var dec, feb, jan, nov, oct, timeline;

    console.info("Welcome to *prores_fu*");
    window.Month = Month;
    jan = new Month.fromName('jan');
    console.log(jan);
    feb = new Month.fromName('feb');
    console.log(feb);
    oct = new Month.fromName('oct');
    console.log(oct);
    nov = new Month.fromName('nov');
    console.log(nov);
    dec = new Month.fromName('December');
    console.log(dec);
    console.log("fromToday");
    console.log(Month.fromToday());
    window.Timeline = Timeline;
    timeline = window.tl = new Timeline($("#timeline"));
    timeline.addSection("SectionTitle Goes Here lala", ["eins", "zwei", "drei", "vier", "fünf", "sechs", "sieben"]);
    timeline.addMonth(Month.fromName('oct'));
    timeline.addMonth(Month.fromName('nov'));
    timeline.addMonth(Month.fromName('dec'));
    timeline.addMonth(Month.fromName('jan', 2013));
    timeline.addMonth(Month.fromName('feb', 2013));
    timeline.addMonth(Month.fromName('mar', 2013));
    return Month.currentWeek();
  });

}).call(this);
