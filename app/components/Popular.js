var React = require('react');
var PropTypes = require('prop-types');
var api = require('../util/api')


function SelectedLanguage(props) {
    var languages = ['All', 'Java', 'Javascript', 'Python', 'Ruby', 'CSS'];
    return (
        <ul className="languages">
            {  
                languages.map(function(lang) {
                    return (
                        <li 
                        style = {lang == props.selectedLang ? {color: '#d0021b'} : null}
                        onClick = {props.onSelect.bind(null, lang)}
                        key={lang}> 
                            {lang} 
                        </li>
                    )
                })
            }
        </ul>   
    )
}

function RepoGrid(props) {
    return (
        <ul className='popular-list'>
           {props.repos.map(function(repo, index) {
               return(
                <li key={repo.name} className='popular-item'>
                    <div className='popular-rank'>#{index+1}</div>
                    <ul className='space-list-items'>
                        <li>
                            <img className='avatar'
                            src = {repo.owner.avatar_url}
                            alt= {'Avatar for' +repo.owner.login}
                            />
                        </li>
                        <li> <a href = {repo.html_url}>{repo.name}</a></li> 
                        <li> @{repo.owner.login} </li>
                        <li> {repo.stargazers_count} stars </li>
                    </ul>
                </li>
               )
            })
        }
        </ul>
    )
} 

RepoGrid.prototype = {
    repos : PropTypes.array.isRequired
}


SelectedLanguage.prototype = {
    selectedLang : PropTypes.string.isRequired,
    onSelect : PropTypes.func.isRequired,
}

class Popular extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            selectedLang : 'All',
            repos:null
        };
        this.updateLanguage = this.updateLanguage.bind(this);
    }

    updateLanguage(lang) {
        this.setState(function(){
            return {
                selectedLang : lang,
                repos:null
            }            
        });
        api.fetchPopularUris(lang).
        then(function(repos) {
            console.log(repos);
            this.setState(function() {
                return {
                    repos:repos 
                }
            });
        }.bind(this))
    }

    componentDidMount() {
        this.updateLanguage(this.state.selectedLang);
    }

    render() {
        return (
            <div> 
                <SelectedLanguage 
                    selectedLang = {this.state.selectedLang}
                    onSelect = {this.updateLanguage}
                />
                {!this.state.repos ? <p> LOADING </p> :
                <RepoGrid repos = {this.state.repos} />}
            </div>
        )
    }
}

module.exports = Popular;