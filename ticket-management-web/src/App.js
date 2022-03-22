import "antd/dist/antd.css";
import "./App.css";
import { Layout } from "antd";
import TicketRecord from "./TicketRecord";

const { Content } = Layout;

function App() {
  return (
    <Layout className="layout" style={{ height: "100vh", width: "100vw" }}>
      <Content style={{ padding: "16px 32px" }}>
        <div style={{ background: "#fff", padding: 24, minHeight: 280 }}>
          <TicketRecord />
        </div>
      </Content>
    </Layout>
  );
}

export default App;
