// frontend/src/App.jsx
import { useEffect, useState } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

function App() {
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: "",
    email: "",
    phone: "",
    city: "",
  });

  const isEditing = form.id !== null;

  // Carregar lista
  const fetchClients = async () => {
    const res = await fetch(`${API_URL}/clients`);
    const data = await res.json();
    setClients(data);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEditing) {
      await fetch(`${API_URL}/clients/${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch(`${API_URL}/clients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }

    setForm({ id: null, name: "", email: "", phone: "", city: "" });
    fetchClients();
  };

  const handleEdit = (client) => {
    setForm(client);
  };

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/clients/${id}`, {
      method: "DELETE",
    });
    fetchClients();
  };

  return (
    <div className="container">
      <h1>CRUD de Clientes</h1>

      <form onSubmit={handleSubmit} className="card">
        <h2>{isEditing ? "Editar Cliente" : "Novo Cliente"}</h2>
        <input
          name="name"
          placeholder="Nome"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          placeholder="E-mail"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="phone"
          placeholder="Telefone"
          value={form.phone}
          onChange={handleChange}
          required
        />
        <input
          name="city"
          placeholder="Cidade"
          value={form.city}
          onChange={handleChange}
          required
        />
        <button type="submit">
          {isEditing ? "Salvar alterações" : "Adicionar"}
        </button>
      </form>

      <div className="card">
        <h2>Lista de Clientes</h2>
        {clients.length === 0 && <p>Nenhum cliente cadastrado.</p>}
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Telefone</th>
              <th>Cidade</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>{c.phone}</td>
                <td>{c.city}</td>
                <td>
                  <button onClick={() => handleEdit(c)}>Editar</button>
                  <button onClick={() => handleDelete(c.id)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
