import './style.css';

// 1. Type Alias & Union Type
type StatusTugas = 'Belum Selesai' | 'Selesai';
type FilterStatus = 'Semua' | StatusTugas;

// 2. Interface dengan Primitive Types (number, string, boolean)
interface Tugas {
  id: number;
  judul: string;
  mataKuliah: string;
  deadline: string;
  status: StatusTugas;
  prioritasTinggi: boolean;
}

// 3. Generics sederhana untuk LocalStorage & Filter
function simpanKeStorage<T>(kunci: string, data: T): void {
  localStorage.setItem(kunci, JSON.stringify(data));
}

function ambilDariStorage<T>(kunci: string, nilaiDefault: T): T {
  const tersimpan = localStorage.getItem(kunci);
  return tersimpan ? (JSON.parse(tersimpan) as T) : nilaiDefault;
}

function saringItem<T>(daftar: T[], predikat: (item: T) => boolean): T[] {
  return daftar.filter(predikat);
}

// 4. Environment Variables dari file .env
const APP_TITLE: string = import.meta.env.VITE_APP_TITLE || 'Manajer Tugas Kuliah';
const APP_VERSION: string = import.meta.env.VITE_APP_VERSION || '1.0.0';
const AUTHOR_NAME: string = import.meta.env.VITE_AUTHOR_NAME || 'Afdhal Jihadi';
const STORAGE_KEY: string = 'daftar_tugas_kuliah_v1';

// 5. Array State bertipe Tugas[]
let daftarTugas: Tugas[] = ambilDariStorage<Tugas[]>(STORAGE_KEY, [
  {
    id: 1,
    judul: 'Implementasi TypeScript & Vite',
    mataKuliah: 'Pengembangan Aplikasi Web',
    deadline: '2026-11-30',
    status: 'Belum Selesai',
    prioritasTinggi: true,
  },
]);

let idSedangEdit: number | null = null;
let filterAktif: FilterStatus = 'Semua';

const app = document.querySelector<HTMLDivElement>('#app')!;

function renderApp(): void {
  document.title = APP_TITLE;

  const tugasTerfilter =
    filterAktif === 'Semua'
      ? daftarTugas
      : saringItem<Tugas>(daftarTugas, (t) => t.status === filterAktif);

  app.innerHTML = `
    <div class="container">
      <header>
        <div>
          <h1>${APP_TITLE}</h1>
          <small style="color: var(--muted)">Oleh: ${AUTHOR_NAME}</small>
        </div>
        <span class="badge-env">v${APP_VERSION} • Vite + TypeScript</span>
      </header>

      <section class="card">
        <h2 style="font-size: 1.05rem; margin-bottom: 1rem;">
          ${idSedangEdit !== null ? 'Edit Tugas Kuliah' : 'Tambah Tugas Baru'}
        </h2>
        <form id="form-tugas">
          <div class="form-grid">
            <div class="form-group">
              <label for="judul">Judul Tugas</label>
              <input type="text" id="judul" placeholder="Contoh: Laporan Praktikum" required />
            </div>
            <div class="form-group">
              <label for="matkul">Mata Kuliah</label>
              <input type="text" id="matkul" placeholder="Contoh: Pengembangan Web" required />
            </div>
            <div class="form-group">
              <label for="deadline">Tenggat Waktu (Deadline)</label>
              <input type="date" id="deadline" required />
            </div>
            <div class="form-group" style="justify-content: center;">
              <label style="display: flex; align-items: center; gap: 0.5rem; margin-top: 1.2rem; cursor: pointer;">
                <input type="checkbox" id="prioritas" />
                Tandai Prioritas Tinggi
              </label>
            </div>
          </div>
          <div class="btn-group">
            <button type="submit" class="btn-primary">
              ${idSedangEdit !== null ? 'Simpan Perubahan' : 'Tambah Tugas'}
            </button>
            ${
              idSedangEdit !== null
                ? '<button type="button" id="btn-batal" class="btn-secondary">Batal</button>'
                : ''
            }
          </div>
        </form>
      </section>

      <section class="card">
        <div class="toolbar">
          <strong>Daftar Tugas (${tugasTerfilter.length})</strong>
          <select id="filter-status">
            <option value="Semua" ${filterAktif === 'Semua' ? 'selected' : ''}>Semua Status</option>
            <option value="Belum Selesai" ${filterAktif === 'Belum Selesai' ? 'selected' : ''}>Belum Selesai</option>
            <option value="Selesai" ${filterAktif === 'Selesai' ? 'selected' : ''}>Selesai</option>
          </select>
        </div>

        <div class="task-list">
          ${
            tugasTerfilter.length === 0
              ? '<p style="color: var(--muted); text-align: center; padding: 1rem;">Belum ada tugas pada kategori ini.</p>'
              : tugasTerfilter
                  .map(
                    (tugas) => `
                <div class="task-item ${tugas.status === 'Selesai' ? 'done' : ''}">
                  <div>
                    <h3>
                      ${tugas.prioritasTinggi ? '🔥 ' : ''}${tugas.judul}
                      <span class="status-pill ${
                        tugas.status === 'Selesai' ? 'status-done' : 'status-pending'
                      }">${tugas.status}</span>
                    </h3>
                    <div class="task-meta">
                      📚 ${tugas.mataKuliah} &nbsp;|&nbsp; 📅 Deadline: ${tugas.deadline}
                    </div>
                  </div>
                  <div class="task-actions">
                    <button class="btn-success" data-toggle="${tugas.id}">
                      ${tugas.status === 'Selesai' ? 'Batal Selesai' : 'Selesai'}
                    </button>
                    <button class="btn-warning" data-edit="${tugas.id}">Edit</button>
                    <button class="btn-danger" data-hapus="${tugas.id}">Hapus</button>
                  </div>
                </div>
              `
                  )
                  .join('')
          }
        </div>
      </section>

      <section class="card info-section">
        <h2>Penjelasan Teknologi Proyek</h2>
        <ul>
          <li><strong>Git:</strong> Sistem kontrol versi terdistribusi untuk mencatat riwayat perubahan kode, mengelola cabang (<em>branching</em>), dan menggabungkan pekerjaan (<em>merging</em>).</li>
          <li><strong>npm (Node Package Manager):</strong> Manajer paket JavaScript untuk menginstal dependensi proyek serta menjalankan skrip pengembangan dan build.</li>
          <li><strong>TypeScript:</strong> Superset dari JavaScript yang menambahkan pengetikan statis (<em>static typing</em>) guna mencegah bug sebelum kode dijalankan.</li>
          <li><strong>Vite:</strong> Build tool modern yang menyediakan server pengembangan super cepat menggunakan ES Modules serta membundel aset produksi.</li>
          <li><strong>Environment Variables (.env):</strong> Berkas konfigurasi untuk menyimpan variabel lingkungan aplikasi secara terpisah dari kode sumber utama.</li>
          <li><strong>Peran Compiler, Transpiler, dan Bundler:</strong> <em>Compiler/Transpiler</em> (seperti <code>tsc</code> dan esbuild) mengubah kode TypeScript modern menjadi JavaScript standar yang dipahami browser, sedangkan <em>Bundler</em> (Rollup pada Vite) menggabungkan dan mengoptimalkan seluruh modul JS, CSS, dan aset menjadi paket siap produksi.</li>
        </ul>
      </section>

      <footer style="text-align:center; margin-top:1.5rem; color:var(--primary); font-size:0.85rem;">© 2026 Afdhal Jihadi - Praktikum PAW</footer>
      <footer style="text-align:center; margin-top:0.35rem; color:var(--muted); font-size:0.85rem;">Dibuat untuk Tugas Pertemuan 6 - Pengembangan Aplikasi Web</footer>
    </div>
  `;

  pasangEventListeners();
}

function pasangEventListeners(): void {
  const form = document.querySelector<HTMLFormElement>('#form-tugas')!;
  const inputJudul = document.querySelector<HTMLInputElement>('#judul')!;
  const inputMatkul = document.querySelector<HTMLInputElement>('#matkul')!;
  const inputDeadline = document.querySelector<HTMLInputElement>('#deadline')!;
  const inputPrioritas = document.querySelector<HTMLInputElement>('#prioritas')!;

  if (idSedangEdit !== null) {
    const target = daftarTugas.find((t) => t.id === idSedangEdit);
    if (target) {
      inputJudul.value = target.judul;
      inputMatkul.value = target.mataKuliah;
      inputDeadline.value = target.deadline;
      inputPrioritas.checked = target.prioritasTinggi;
    }
  }

  form.addEventListener('submit', (e: Event) => {
    e.preventDefault();
    const judul = inputJudul.value.trim();
    const mataKuliah = inputMatkul.value.trim();
    const deadline = inputDeadline.value;
    const prioritasTinggi = inputPrioritas.checked;

    if (!judul || !mataKuliah || !deadline) return;

    if (idSedangEdit !== null) {
      daftarTugas = daftarTugas.map((t) =>
        t.id === idSedangEdit ? { ...t, judul, mataKuliah, deadline, prioritasTinggi } : t
      );
      idSedangEdit = null;
    } else {
      const tugasBaru: Tugas = {
        id: Date.now(),
        judul,
        mataKuliah,
        deadline,
        status: 'Belum Selesai',
        prioritasTinggi,
      };
      daftarTugas.push(tugasBaru);
    }

    simpanKeStorage<Tugas[]>(STORAGE_KEY, daftarTugas);
    renderApp();
  });

  document.querySelector('#btn-batal')?.addEventListener('click', () => {
    idSedangEdit = null;
    renderApp();
  });

  document.querySelector<HTMLSelectElement>('#filter-status')?.addEventListener('change', (e) => {
    filterAktif = (e.target as HTMLSelectElement).value as FilterStatus;
    renderApp();
  });

  document.querySelectorAll<HTMLButtonElement>('[data-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.toggle);
      daftarTugas = daftarTugas.map((t) =>
        t.id === id
          ? { ...t, status: t.status === 'Selesai' ? 'Belum Selesai' : 'Selesai' }
          : t
      );
      simpanKeStorage<Tugas[]>(STORAGE_KEY, daftarTugas);
      renderApp();
    });
  });

  document.querySelectorAll<HTMLButtonElement>('[data-edit]').forEach((btn) => {
    btn.addEventListener('click', () => {
      idSedangEdit = Number(btn.dataset.edit);
      renderApp();
    });
  });

  document.querySelectorAll<HTMLButtonElement>('[data-hapus]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.hapus);
      daftarTugas = daftarTugas.filter((t) => t.id !== id);
      if (idSedangEdit === id) idSedangEdit = null;
      simpanKeStorage<Tugas[]>(STORAGE_KEY, daftarTugas);
      renderApp();
    });
  });
}

renderApp();