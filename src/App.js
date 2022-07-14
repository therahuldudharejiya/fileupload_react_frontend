import './App.css';
import Header from './Header';
import Home from './Home';
import Footer from './Footer';

function App() {
	return (
		<>
			<Header />
			<div className="container">
				<Home />
			</div>
			<Footer />
		</>
	);
}

export default App;
