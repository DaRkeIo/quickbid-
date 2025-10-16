const reportWebVitals = (onPerfEntry?: (metric: any) => void) => {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
      onCLS(onPerfEntry, { reportAllChanges: true });
      onFID(onPerfEntry, { reportAllChanges: true });
      onFCP(onPerfEntry, { reportAllChanges: true });
      onLCP(onPerfEntry, { reportAllChanges: true });
      onTTFB(onPerfEntry, { reportAllChanges: true });
    });
  }
};

export default reportWebVitals;
