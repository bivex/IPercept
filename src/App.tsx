import { useEffect } from 'react';
import { useGame } from './useGame';
import { LANGUAGES, SOURCES } from './api';

function App() {
  const game = useGame();

  useEffect(() => {
    game.loadNext();
  }, [game.lang, game.source]);

  const currentLang = LANGUAGES.find(l => l.code === game.lang);
  const currentSource = SOURCES.find(s => s.id === game.source);

  return (
    <div className="ui container" style={{ paddingTop: '2em', paddingBottom: '4em' }}>
      <h1 className="ui centered header" style={{ marginTop: '0' }}>
        <i className="eye icon"></i>
        <div className="content">IPercept</div>
      </h1>

      <div className="ui centered grid">
        <div className="ui compact menu" style={{ marginBottom: '1.5em' }}>
          <div className="ui simple dropdown item">
            <i className={`${currentSource?.icon} icon`}></i>
            {currentSource?.label}
            <i className="dropdown icon"></i>
            <div className="menu">
              {SOURCES.map(s => (
                <div
                  key={s.id}
                  className={`item${s.id === game.source ? ' active' : ''}`}
                  onClick={() => game.changeSource(s.id)}
                >
                  <i className={`${s.icon} icon`}></i> {s.label}
                </div>
              ))}
            </div>
          </div>

          {game.source === 'wikipedia' && (
            <div className="ui simple dropdown item">
              <span style={{ marginRight: '0.3em' }}>{currentLang?.flag}</span>
              {currentLang?.label}
              <i className="dropdown icon"></i>
              <div className="menu">
                {LANGUAGES.map(l => (
                  <div
                    key={l.code}
                    className={`item${l.code === game.lang ? ' active' : ''}`}
                    onClick={() => game.changeLang(l.code)}
                  >
                    {l.flag} {l.label}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="item">
            <i className="trophy icon"></i>
            {game.score} / {game.total}
          </div>
        </div>
      </div>

      {game.loading && (
        <div className="ui active centered inline loader" style={{ marginTop: '5em' }}>
          Loading
        </div>
      )}

      {game.error && (
        <div className="ui negative message">
          <div className="header">Error</div>
          <p>{game.error}</p>
          <button className="ui button" onClick={game.loadNext}>Try again</button>
        </div>
      )}

      {game.photo && !game.loading && (
        <div className="ui centered card" style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
          <div className="image" style={{ background: '#f0f0f0', textAlign: 'center' }}>
            <img
              src={game.photo.imageUrl}
              alt="Guess what this is"
              style={{ maxHeight: '420px', objectFit: 'contain' }}
            />
          </div>

          {!game.revealed ? (
            <div className="content">
              <div className="ui action input fluid" style={{ marginBottom: '0.5em' }}>
                <input
                  type="text"
                  value={game.guess}
                  onChange={e => game.setGuess(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && game.submitGuess()}
                  placeholder="What do you see?"
                  autoFocus
                />
                <button
                  className="ui violet button"
                  onClick={game.submitGuess}
                  disabled={!game.guess.trim()}
                >
                  Submit
                </button>
              </div>
              {game.photo.source === 'unsplash' && (
                <p style={{ textAlign: 'center', color: '#888', fontSize: '0.85em' }}>
                  Hint: describe the scene, objects, or mood
                </p>
              )}
              <div style={{ textAlign: 'center' }}>
                <button className="ui basic button" onClick={game.skip}>
                  Skip
                </button>
              </div>
            </div>
          ) : (
            <div className="content center aligned">
              {game.correct ? (
                <div className="ui green header">Correct!</div>
              ) : (
                <div className="ui red header">Wrong!</div>
              )}
              <h3 className="ui header">{game.photo.title}</h3>
              {game.photo.tags.length > 0 && (
                <div style={{ marginBottom: '0.8em' }}>
                  {game.photo.tags.map(tag => (
                    <span key={tag} className="ui mini violet label">{tag}</span>
                  ))}
                </div>
              )}
              {game.photo.description && (
                <p style={{ color: '#666' }}>{game.photo.description}</p>
              )}
              <button className="ui violet button" onClick={game.loadNext}>
                Next photo <i className="right arrow icon"></i>
              </button>
            </div>
          )}
        </div>
      )}

      {game.history.length > 0 && (
        <div className="ui segment" style={{ marginTop: '2em' }}>
          <h4 className="ui header">History</h4>
          <div className="ui divided items">
            {game.history.slice(-5).reverse().map((round, i) => (
              <div
                key={i}
                className={`item ${round.correct ? 'positive' : 'error'}`}
                style={{
                  padding: '0.5em',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1em',
                }}
              >
                <img
                  className="ui tiny rounded image"
                  src={round.photo.imageUrl}
                  alt={round.photo.title}
                  style={{ width: '48px', height: '48px', objectFit: 'cover', flexShrink: 0 }}
                />
                <div className="middle aligned content">
                  <div className="header">
                    {round.photo.title}
                    <span className="ui mini label" style={{ marginLeft: '0.5em' }}>
                      {round.photo.source}
                    </span>
                  </div>
                  <div className="meta">Your guess: {round.userGuess}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
