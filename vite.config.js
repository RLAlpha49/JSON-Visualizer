const reactRefresh = require('@vitejs/plugin-react-refresh')

module.exports = {
  root: './src',
  plugins: [reactRefresh()],
  build: {
    outDir: '../dist',
    rollupOptions: {
      output: {
        manualChunks: {
          'react': ['react', 'react-dom'],
          'buttons': ['./src/components/graph/extras/GraphButton.jsx', './src/components/graph/extras/DarkModeButton.jsx'],
          'utils': ['./src/components/graph/utils/CalculateNodeSize.jsx', './src/components/graph/utils/ConvertJson.jsx', "./src/components/graph/utils/TextColor.jsx"],
          'editor': ['./src/components/graph/Editor.jsx'],
          'graph': ['./src/components/graph/Graph.jsx', "./src/components/graph/GraphCanvas.jsx"],
        }
      }
    },
    chunkSizeWarningLimit: 3000
  },
}