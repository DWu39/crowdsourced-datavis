

        // ---------- HOLD DATA ---------- //
        var model = {
            init: function(data) {
                var that = this;
                this.users = {};
                this.links = [];
                this.color = d3.scale.category20();

                if (data) {
                    // read in the data
                    data.forEach(function(message) {
                        if (!that.getUserByName(message.name)) {
                            that.addUser(message.name);
                        }
                        var user = that.getUserByName(message.name);
                        if (user) {
                            that.addMessage(user.id, message.text, message.timestamp);

                            // assume user sends message to all users currently in room
                            var users = Object.keys(that.users);
                            var value = that.computeValue(message.text);

                            users.forEach(function(name) {
                                that.addLink(user.id, that.users[name].id, value);
                            });
                        }
                    });
                }
            },

            addUser: function(name) {
                var user = new User(name);
                user.color = this.color(Math.random());
                this.users[user.id] = user;
            },

            removeUser: function(id) {
                delete this.users.id;
            },

            getNumUsers: function() {
                var size = 0;
                for (var key in this.users) {
                    if (this.users.hasOwnProperty(key)) size++;
                }
                return size;
            },

            getUserByName: function(name) {
                for (var id in this.users) {
                    var user = this.users[id];
                    if (user.name === name) return user;
                }
                return null;
            },

            addMessage: function(id, message, timestamp) {
                try {
                    if (!this.users[id]) throw 'user id bad';
                    this.users[id].addMessage(message, timestamp);
                }
                catch (err) {
                    alert('could not add message because ' + err);
                }
            },

            addLink: function(src, target, value) {
                var value = typeof value !== 'undefined' ? value : 1;

                var link;

                // find link with src and target in links
                this.links.forEach(function(link) {
                    if (link.source === src && link.target === target) { link = link; }
                });

                if (link) {
                    link.value += value;
                } else {
                    this.links.push({source: src, target: target, value: value});
                }
            },

            computeValue: function(datum) {
                return datum.length;
            }
        }

        var matrix = {
            init: function(width) {
                width = typeof width !== 'undefined' ? width : 720;

                this.matrix = [];
                this.ordering = nameOrdering;
                this.x = d3.scale.ordinal().rangeBands([0, width]); // for the position of user
                this.z = d3.scale.linear().domain([0, 4]).clamp(true); // for the link strength, only 5 levels
                this.c = d3.scale.category10().domain(d3.range(10)); // for the cluster colors
            },

            setOrdering: function(ordering) {
                if (this.hasOwnProperty(ordering)) this.ordering = ordering;
                else console.log('ordering not found');
            },

            nameOrdering: function() {
                var obj = model.users,
                    users = Object.keys(obj).map(function(key) { return obj[key]; });

                return d3.range(this.matrix.length).sort(function(a, b) {
                    return d3.ascending(users[a].name, users[b].name);
                });
            },

            // insert new row for a user in the right location
            addUser: function(user) {
                if (!user.id in model.users) {
                    console.log('user does not exist');

                } else {
                    var ordering = this.ordering();

                    var matrix = this.matrix,
                        n = matrix.length;
                    // append new column to old rows
                    matrix.map(function(row, i) { row.push({x: n, y: i, z: 0 }); });
                    // create new row
                    matrix[n] = d3.range(n+1).map(function(j) { return {x: j, y: n, z: 0 }; });
                }
            },

            // return index corresponding to id
            getIndex: function(id) {
                matrix[0].forEach(function(col, i) {
                    if (col.id == id) return i;
                });
                return null;
            },

            // create new link or add value to existing link
            newLink: function(src, target, value) {
                var srcIndex = getIndex(src),
                    targetIndex = getIndex(target);

                if (matrix[srcIndex][targetIndex] > 0) {
                    matrix[srcIndex][targetIndex] += value;
                } else {
                    matrix[srcIndex][targetIndex] = value;
                }
            }
        }

        function createMatrix(model) {
            d3.select('#matrix svg').remove();
            var margin = {top: 80, right: 0, bottom: 10, left: 80},
                width = 480,
                height = 480;

            var svg = d3.select('#matrix').append('svg')
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .style("margin-left", margin.left + "px")
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var x = d3.scale.ordinal().rangeBands([0, width]), // for the position of user
                z = d3.scale.linear().clamp(true); // for the link strength

            var matrix = [],
                users = model.users,
                links = model.links,
                n = model.getNumUsers();

            // initialize matrix
            for (var i=0; i<n; i++) {
                matrix[i] = d3.range(n).map(function(j) { return {x: j, y: i, z: 0}; });
            };

            links.forEach(function(link) {
                matrix[link.source][link.target].z += link.value; // bottom left triangle
                // matrix[link.target][link.source].z += link.value; // top right triangle
                // matrix[link.source][link.source].z += link.value; // node to itself
                // matrix[link.target][link.target].z += link.value; // node to itself
            })

            // ordering of the elements in the matrix
            var nameOrdering = d3.range(n).sort(function(a, b) {
                return d3.ascending(users[a].name, users[b].name);
            })

            x.domain(nameOrdering);
            z.domain([0, d3.max(links, function(link) { return link.value; })]);

            svg.append("rect")
                .attr("class", "background")
                .attr("width", width)
                .attr("height", height);

            var row = svg.selectAll(".row").data(matrix).enter()
                .append("g")
                .attr("class", "row")
                .attr("transform", function(d, i) { return "translate(0," + x(i) + ")"; })
                .each(row);

            row.append("line").attr("x2", width);

            row.append("text")
                .attr("x", -6)
                .attr("y", x.rangeBand() / 2)
                .attr("dy", ".32em")
                .attr("text-anchor", "end")
                .text(function(d, i) { return users[i].name; });

            var column = svg.selectAll(".column")
                .data(matrix)
                .enter().append("g")
                .attr("class", "column")
                .attr("transform", function(d, i) { return "translate(" + x(i) + ")rotate(-90)"; });

            column.append("line").attr("x1", -width);

            column.append("text")
                  .attr("x", 6)
                  .attr("y", x.rangeBand() / 2)
                  .attr("dy", ".32em")
                  .attr("text-anchor", "start")
                  .text(function(d, i) { return users[i].name; });

            function row(row) {
                var cell = d3.select(this).selectAll(".cell")
                    .data(row.filter(function(d) { return d.z; }))
                    .enter().append("rect")
                        .attr("class", "cell")
                        .attr("x", function(d) { return x(d.x); })
                        .attr("width", x.rangeBand())
                        .attr("height", x.rangeBand())
                        .style("fill-opacity", function(d) { return z(d.z); })
                        // .style("fill", function(d) { console.log(users[d.x]); return users[d.x].color; })
                        .on("mouseover", mouseover)
                        .on("mouseout", mouseout);
            }

            function mouseover(p) {
                console.log(p);
                d3.selectAll(".row text").classed("active", function(d, i) { return i == p.y; });
                d3.selectAll(".column text").classed("active", function(d, i) { return i == p.x; });
            }

            function mouseout() {
                d3.selectAll("text").classed("active", false);
            }
        }