import { Component, computed, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { toast } from 'ngx-sonner';
import { RecursosService } from '../../services/recursos.service';
import { RecursosFilterService } from '../../services/recursos-filter.service';
import { Recurso, CreateRecursoRequest } from '../../models/recursos.model';
import { RecursosHeaderComponent } from './components/recursos-header/recursos-header.component';
import { RecursosRowComponent } from './components/recursos-row/recursos-row.component';
import { RecursosActionComponent } from './components/recursos-action/recursos-action.component';
import { RecursosFooterComponent } from './components/recursos-footer/recursos-footer.component';
import { ModalComponent } from '../../../dashboard/components/modal/modal/modal.component';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
    selector: 'app-recursos',
    standalone: true,
    imports: [
        CommonModule,
        AngularSvgIconModule,
        FormsModule,
        RecursosHeaderComponent,
        RecursosRowComponent,
        RecursosActionComponent,
        RecursosFooterComponent,
        ModalComponent
    ],
    templateUrl: './recursos.component.html',
    styleUrl: './recursos.component.scss'
})
export class RecursosComponent implements OnInit {
    recursos = signal<Recurso[]>([]);
    isLoading = false;
    isModalOpenExport = false;
    isExporting: 'pdf' | 'csv' | null = null;
    currentPage = 1;
    pageSize = 10;
    totalRecursos = 0;

    constructor(
        private recursosService: RecursosService,
        private filterService: RecursosFilterService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadRecursos();
    }

    loadRecursos(): void {
        this.isLoading = true;
        this.recursosService.getRecursos().subscribe({
            next: (recursos) => {
                this.recursos.set(recursos);
                this.totalRecursos = recursos.length;
                this.isLoading = false;
            },
            error: (error) => {
                this.handleRequestError(error);
                this.isLoading = false;
            }
        });
    }

    pagedRecursos = computed(() => {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        return this.filteredRecursos().slice(startIndex, endIndex);
    });

    filteredRecursos = computed(() => {
        const search = this.filterService.searchField().toLowerCase();
        const category = this.filterService.categoryField();
        const type = this.filterService.typeField();

        return this.recursos().filter((recurso) => {
            const matchesSearch =
                recurso.title.toLowerCase().includes(search) ||
                recurso.description.toLowerCase().includes(search);

            const matchesCategory = category === 'Todas' || recurso.category === category;
            const matchesType = type === 'Todas' || recurso.type === type;

            return matchesSearch && matchesCategory && matchesType;
        });
    });

    selectedRecursos = signal<Recurso[]>([]);

    changePage(page: number): void {
        this.currentPage = page;
    }

    changePageSize(size: number): void {
        this.pageSize = size;
        this.currentPage = 1;
    }

    openModal(): void {
        this.router.navigate(['/layout/vzor-cms/recursos/new']);
    }

    openEditModal(recurso: Recurso): void {
        this.router.navigate(['/layout/vzor-cms/recursos/edit', recurso.id]);
    }

    deleteRecurso(id: number): void {
        this.recursosService.deleteRecurso(id).subscribe({
            next: () => {
                toast.success('Recurso eliminado exitosamente!');
                this.loadRecursos();
            },
            error: (error) => this.handleRequestError(error)
        });
    }

    toggleRecursoSelection(recurso: Recurso): void {
        const selected = this.selectedRecursos();
        const index = selected.findIndex(r => r.id === recurso.id);

        if (index > -1) {
            this.selectedRecursos.set(selected.filter(r => r.id !== recurso.id));
        } else {
            this.selectedRecursos.set([...selected, recurso]);
        }
    }

    toggleRecursos(checked: boolean): void {
        if (checked) {
            this.selectedRecursos.set([...this.filteredRecursos()]);
        } else {
            this.selectedRecursos.set([]);
        }
    }

    isDeleteButtonEnabled(): boolean {
        return this.selectedRecursos().length > 0;
    }

    deleteSelected(): void {
        if (confirm(`¿Estás seguro de que quieres eliminar ${this.selectedRecursos().length} recursos?`)) {
            const deletePromises = this.selectedRecursos().map(recurso =>
                this.recursosService.deleteRecurso(recurso.id).toPromise()
            );

            Promise.all(deletePromises).then(() => {
                toast.success(`${this.selectedRecursos().length} recursos eliminados exitosamente!`);
                this.selectedRecursos.set([]);
                this.loadRecursos();
            }).catch(error => {
                this.handleRequestError(error);
            });
        }
    }

    openExportConfirmation(type: 'pdf' | 'csv'): void {
        this.isExporting = type;
        this.isModalOpenExport = true;
    }

    handleExportConfirmation(type: 'pdf' | 'csv'): void {
        this.isModalOpenExport = false;
        if (type === 'pdf') {
            this.exportToPDF();
        } else if (type === 'csv') {
            this.exportToCSV();
        }
    }

    exportToPDF(): void {
        const doc = new jsPDF();
        const recursos = this.filteredRecursos();

        doc.text('Recursos - VZOR CMS', 14, 22);

        autoTable(doc, {
            head: [['Título', 'Tipo', 'Categoría', 'Descargas', 'Fecha']],
            body: recursos.map(recurso => [
                recurso.title,
                recurso.type,
                recurso.category,
                recurso.downloads?.toString() || '0',
                recurso.createdAt ? new Date(recurso.createdAt).toLocaleDateString() : 'Sin fecha'
            ]),
            startY: 30,
        });

        doc.save('recursos.pdf');
        toast.success('PDF exportado exitosamente!');
    }

    exportToCSV(): void {
        const recursos = this.filteredRecursos();
        const csvContent = [
            ['Título', 'Tipo', 'Categoría', 'Descargas', 'Fecha'],
            ...recursos.map(recurso => [
                recurso.title,
                recurso.type,
                recurso.category,
                recurso.downloads?.toString() || '0',
                recurso.createdAt ? new Date(recurso.createdAt).toLocaleDateString() : 'Sin fecha'
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'recursos.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success('CSV exportado exitosamente!');
    }

    onSearchChange(searchTerm: string): void {
        this.filterService.searchField.set(searchTerm);
    }

    onCategoryChange(category: string): void {
        this.filterService.categoryField.set(category);
    }

    onTypeChange(type: string): void {
        this.filterService.typeField.set(type);
    }

    private handleRequestError(error: any): void {
        const msg = 'Ocurrió un error. Por favor, inténtelo de nuevo.';
        toast.error(msg, {
            position: 'top-right',
            description: error.message,
        });
        console.error(error);
    }
}
