# gui/main_window.py

import sys
from PyQt5.QtWidgets import (
    QMainWindow, QFileDialog, QWidget, QVBoxLayout, QLabel, QPushButton,
    QHBoxLayout, QComboBox, QDateEdit
)
from PyQt5.QtCore import Qt, QDate
from data.data_handler import load_data, get_categories, filter_data
import plotly.express as px
from PyQt5.QtWebEngineWidgets import QWebEngineView  # Requires PyQtWebEngine

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle('Financial Tracker')
        self.setGeometry(100, 100, 800, 600)
        self.data = None

        self.init_ui()

    def init_ui(self):
        # Central widget
        central_widget = QWidget()
        self.setCentralWidget(central_widget)

        # Layout
        layout = QVBoxLayout()
        central_widget.setLayout(layout)

        # Labels and Buttons
        self.label = QLabel('No data loaded.')
        layout.addWidget(self.label)

        load_button = QPushButton('Load CSV')
        load_button.clicked.connect(self.load_csv)
        layout.addWidget(load_button)

        # Filter layout
        filter_layout = QHBoxLayout()

        # Date filters
        self.start_date = QDateEdit(calendarPopup=True)
        self.start_date.setDate(QDate.currentDate().addMonths(-1))
        self.end_date = QDateEdit(calendarPopup=True)
        self.end_date.setDate(QDate.currentDate())
        filter_layout.addWidget(QLabel('Start Date:'))
        filter_layout.addWidget(self.start_date)
        filter_layout.addWidget(QLabel('End Date:'))
        filter_layout.addWidget(self.end_date)

        # Category filter
        self.category_combo = QComboBox()
        filter_layout.addWidget(QLabel('Category:'))
        filter_layout.addWidget(self.category_combo)

        # Apply filter button
        filter_button = QPushButton('Apply Filters')
        filter_button.clicked.connect(self.apply_filters)
        filter_layout.addWidget(filter_button)

        layout.addLayout(filter_layout)

    def load_csv(self):
        csv_file, _ = QFileDialog.getOpenFileName(self, 'Open CSV', '', 'CSV Files (*.csv)')
        if csv_file:
            self.data = load_data(csv_file)
            self.label.setText('Data loaded successfully.')
            categories = get_categories(self.data)
            self.category_combo.clear()
            self.category_combo.addItem('All')
            self.category_combo.addItems(categories)
            self.plot_data()

    def apply_filters(self):
        if self.data is not None:
            start_date = self.start_date.date().toPyDate()
            end_date = self.end_date.date().toPyDate()
            category = self.category_combo.currentText()
            categories = None if category == 'All' else [category]
            filtered_data = filter_data(
                self.data,
                start_date=start_date,
                end_date=end_date,
                categories=categories
            )
            self.plot_filtered_data(filtered_data)

    def plot_data(self):
        if self.data is not None:
            fig = px.line(
                self.data,
                x='Date',
                y='Amount',
                title='Spending Over Time'
            )
            self.show_plot(fig)

    def plot_filtered_data(self, data):
        fig = px.bar(
            data,
            x='Date',
            y='Amount',
            color='Category',
            title='Filtered Spending'
        )
        self.show_plot(fig)

    def show_plot(self, fig):
        # Convert Plotly figure to HTML
        html = fig.to_html(include_plotlyjs='cdn')
        # Create a QWebEngineView to display the HTML
        view = QWebEngineView()
        view.setHtml(html)
        # Create a new window to display the plot
        plot_window = QMainWindow(self)
        plot_window.setCentralWidget(view)
        plot_window.resize(800, 600)
        plot_window.show()
