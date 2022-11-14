import ScrollToTop from './components/scrollToTop';
// import { BaseOptionChartStyle } from './components/chart/BaseOptionChart';
import Router from './core/router';
import ThemeProvider from './core/theme';


function App() {
  return (
    <ThemeProvider>
      <ScrollToTop/>
      {/* <BaseOptionChartStyle /> */}
      <Router />
    </ThemeProvider>
  );
}

export default App;
