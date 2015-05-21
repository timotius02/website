// (function(){

// 	$('.explore').click(function(){
// 		$('#intro').ScrollTo();
// 	});
// })();

var projects = require('./projects');

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
            <h3 className="title"> {this.props.title}</h3>
            <p className="description" dangerouslySetInnerHTML={getDesc.call(this)}>
                
            </p>
          </div>
      	</li>
  		</a>

		)
	}
});




React.render(<Card />, document.getElementById('card'));