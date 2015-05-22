var projects = require('./projects');
var React = require('react');
global.jQuery = require('jquery');

jQuery('.explore').click(function() {
    jQuery('#intro').ScrollTo();
});

var Projects = React.createClass({
	render: function() {
		return ( 
			<section id="projects" className="show">
				<h2 className="title">
	          		Recent Projects
	        	</h2>
	        	<CardLayout />
	    	</section>
	    )
	}
});

var CardLayout = React.createClass({
	getInitialState: function(){
		return {projects: projects};
	},
	render: function(){
		var cards = this.state.projects.map(function(cardInfo){
			return <Card {...cardInfo}/>
		});
		return (
        <div className="cardLayout">
        	{cards}
        </div>
		)
	}
});
var Card = React.createClass({
	getDefaultProps: function() {
		return projects[0];
	},
	render: function() {
		var getDesc = function(){
			return {__html: this.props.desc};
		}
		return (
			<a href={this.props.href}>
        <li id={this.props.id} className="card">
          <img src={this.props.imgSrc} alt={this.props.title} className="photo"/>
          <div className="textArea">
            <h3 className="title"> {this.props.title} </h3>
            <p className="description" dangerouslySetInnerHTML={getDesc.call(this)}>
                
            </p>
          </div>
      	</li>
  		</a>

		)
	}
});




React.render(<Projects />, document.getElementById('Projects'));