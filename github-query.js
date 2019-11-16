jQuery.githubUser = function(username, callback) {
   jQuery.getJSON('https://api.github.com/users/'+username+'/repos?sort=updated&per_page=100&callback=?',callback)
}
 
jQuery.fn.loadRepositories = function(username) {
    this.html("<span>Querying GitHub for " + username +"'s repositories...</span>");
     
    var target = this;
    $.githubUser(username, function(data) {
        var repos = data.data; // JSON Parsing
        sortByName(repos);
        var ownedRepos = repos.filter(notAFork)
        console.log(ownedRepos);
     
        var list = $('<div class="box"/>');
        target.empty().append(list);
        $(ownedRepos).each(function() {
            if (this.name != (username.toLowerCase()+'.github.com')) {
                console.log(this);
	            //list.append('<a href="'+ (this.homepage?this.homepage:this.html_url) +'"><img src="https://raw.githubusercontent.com/tomwhite/' + this.name +'/master/logo.png" height="100" width="100"/></a>')
	            //list.append('<a href="'+ (this.homepage?this.homepage:this.html_url) +'">' + this.name + '</a>')
	            list.append('<p>' + '<a href="'+ (this.homepage?this.homepage:this.html_url) +'">' + this.name + '</a> ' + this.description + '</p>')
	            //list.append('<p><a href="' + this.html_url + '">' + this.html_url + '</a></p>')
            }
        });

        var simpleRepos = ownedRepos.map(function(repo) {
            return {
                "name": repo.name,
                "description": repo.description,
                "homepage": repo.homepage,
                "html_url": repo.html_url
            };
        });

        console.log(simpleRepos);

        var featuredProjects = [
            //"most-beautiful-formula",
            //"paper-folding",
            //"mappix",
            "tennis-ball-parabola",
            "earth-moon-game",
            "inversions",
            "dusk",
            "egg-construction",
            "cubesum",
            "leaning-chairs",
            "isitdayornight",
            "gaussian-primes",
            "d3troit",
            "blockclock",
            "longview"
            //"superellipse"
        ];

        featuredProjects = featuredProjects.map(function(name) {
            return simpleRepos.find(function(repo){
                return repo.name == name;
            })
        });

        console.log(featuredProjects);

        download(JSON.stringify(featuredProjects, null, 2), 'projects.json', 'text/plain');


      });
      
	function notAFork(repo) {
	  return repo.fork == false;
	}
    function sortByName(repos) {
        repos.sort(function(a,b) {
        var x = a.pushed_at;
        var y = b.pushed_at;
        return -1 * ((x < y) ? -1 : ((x > y) ? 1 : 0));
       });
    }
    function download(content, fileName, contentType) {
        var a = document.createElement("a");
        var file = new Blob([content], {type: contentType});
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
    }
};