/*
 * Copyright (C) 2025 - Juan Carlos Prieto <nilibox@nilibox.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses>.
 */

#include "common/common.h"
#include "ui/infopanel.h"
#include "ui/tbutton.h"
#include "ui/tcframe.h"
#include "ui/tcombobox.h"
#include <QClipboard>
#include <QDesktopServices>
#include <QDir>
#include <QFontDatabase>
#include <QScrollArea>
#include <QScrollBar>
#include <QScroller>
#include <QTimer>
#include <QUrl>
#include <QVBoxLayout>


InfoPanel::InfoPanel(QWidget *parent) : TPane("info", parent)
{
    m_frame0 = new TPane("info.header", this);
    m_refreshbutton = new TButton("info.header.refresh", this);
    m_closebutton = new TButton("info.header.close", this);
    m_frame1 = new TPane("info.body", this);
    m_cframe1 = new TcFrame("info.body.about", this);
    m_about = new TPane("info.body.about.container", this);
    m_logo = new TPane("info.body.about.logo", this);
    m_version = new TLabel("info.body.about.version", this);
    m_cframe2 = new TcFrame("info.body.license", this);
    m_license_s = new QScrollArea(this);
    m_license = new TPane("info.body.license.container", this);
    m_licensetext = new TLabel("info.body.license.text", this);
    m_cframe3 = new TcFrame("info.body.debug", this);
    m_debug = new TPane("info.body.debug.container", this);
    m_options = new TPane("info.body.debug.buttons", this);
    m_copybutton = new TButton("info.body.debug.buttons.copy", this);
    m_verbosebutton = new TButton("info.body.debug.buttons.verbose", this);
    m_listfiles = new TComboBox("info.body.debug.files", this);
    m_log_s = new QScrollArea(this);
    m_log = new TLabel("info.body.debug.log", this);

    m_layout = new QVBoxLayout(this);
    m_layout0 = new QHBoxLayout(m_frame0);
    m_layout1 = new QVBoxLayout(m_frame1);
    m_layout10 = new QHBoxLayout(m_about);
    m_layout11 = new QHBoxLayout(m_license);
    m_layout12 = new QVBoxLayout(m_debug);
    m_layout120 = new QHBoxLayout(m_options);

    m_layout->setContentsMargins(0, 0, 0, 0);
    m_layout->setSpacing(0);
    m_layout->addWidget(m_frame0);
    m_layout->addWidget(m_frame1);
    m_layout->setStretchFactor(m_frame1, 1);

    m_layout0->setAlignment(Qt::AlignRight);
    m_layout0->setContentsMargins(0, 0, 0, 0);
    m_layout0->setSpacing(0);
    m_layout0->addWidget(m_refreshbutton);
    m_layout0->addWidget(m_closebutton);
    connect(m_refreshbutton, &TButton::clicked, this, &InfoPanel::refreshLogs);
    connect(m_closebutton, &TButton::clicked, this, &InfoPanel::closeButtonClicked);

    m_layout1->setAlignment(Qt::AlignTop);
    m_layout1->setContentsMargins(0, 0, 0, 0);
    m_layout1->setSpacing(0);

    m_layout1->addWidget(m_cframe1);
    connect(m_cframe1, &TcFrame::headerClicked, this, &InfoPanel::panelToggle);

    m_layout10->setAlignment(Qt::AlignLeft);
    m_layout10->setContentsMargins(0, 0, 0, 0);
    m_layout10->setSpacing(0);
    m_layout10->addWidget(m_logo);
    connect(m_logo, &TPane::pressed, this, &InfoPanel::logoButtonClicked);

    QString version;
    version += "Version " + QString(APP_VERSION) + "<br>";
    version += "Build " + QString(APP_BUILD) + "<br>";
    version += "<a href=https://www.nilibox.com>https://www.nilibox.com</a>";
    m_version->setText(version);
    m_layout10->addWidget(m_version);
    m_layout10->setStretchFactor(m_version, 1);
    m_cframe1->setContent(m_about);

    m_layout1->addWidget(m_cframe2);
    connect(m_cframe2, &TcFrame::headerClicked, this, &InfoPanel::panelToggle);

    m_license_s->setWidget(m_licensetext);
    m_license_s->setFrameShape(QFrame::NoFrame);
    m_license_s->setWidgetResizable(true);
    m_license_s->setSizeAdjustPolicy(QAbstractScrollArea::AdjustToContents);
    m_license_s->setHorizontalScrollBarPolicy(Qt::ScrollBarAlwaysOff);
    m_license_s->setVerticalScrollBarPolicy(Qt::ScrollBarAlwaysOff);
    m_license_s->setStyleSheet("background:transparent");
    m_layout11->addWidget(m_license_s);
    m_layout11->setStretchFactor(m_license_s, 1);
    m_layout11->setContentsMargins(0, 0, 0, 0);
    m_layout11->setSpacing(0);
    m_cframe2->setContent(m_license);

    m_layout1->addWidget(m_cframe3);
    connect(m_cframe3, &TcFrame::headerClicked, this, &InfoPanel::panelToggle);

    m_layout12->addWidget(m_options);
    m_layout12->addWidget(m_listfiles);
    connect(m_listfiles, &TComboBox::currentIndexChanged, this, &InfoPanel::refreshLogs);
    m_layout120->addWidget(m_copybutton);
    connect(m_copybutton, &TButton::clicked, this, &InfoPanel::copyButtonClicked);
    m_layout120->addWidget(m_verbosebutton);
    m_verbosebutton->setToggle(true);
    m_verbosebutton->setPressed(G_VERBOSE);
    connect(m_verbosebutton, &TButton::clicked, this, &InfoPanel::verboseButtonClicked);
    m_layout120->setContentsMargins(0, 0, 0, 0);
    m_layout120->setSpacing(0);

    m_log_s->setWidget(m_log);
    m_log_s->setFrameShape(QFrame::NoFrame);
    m_log_s->setWidgetResizable(true);
    m_log_s->setHorizontalScrollBarPolicy(Qt::ScrollBarAlwaysOff);
    m_log_s->setVerticalScrollBarPolicy(Qt::ScrollBarAlwaysOff);
    m_log_s->setStyleSheet("background:transparent");
    m_layout12->addWidget(m_log_s);
    m_layout12->setStretchFactor(m_log_s, 1);
    m_layout12->setContentsMargins(0, 0, 0, 0);
    m_layout12->setSpacing(0);
    m_cframe3->setContent(m_debug);

    QScrollerProperties scrollerproperties = QScroller::scroller(m_log_s)->scrollerProperties();
    scrollerproperties.setScrollMetric(QScrollerProperties::AxisLockThreshold, 1);
    scrollerproperties.setScrollMetric(QScrollerProperties::OvershootScrollTime, G_LOCALSETTINGS.get("ui.animationdelay").toFloat() / 1000);
    QScroller::scroller(m_log_s)->setScrollerProperties(scrollerproperties);
    QScroller::grabGesture(m_log_s, QScroller::LeftMouseButtonGesture);

    scrollerproperties = QScroller::scroller(m_license_s)->scrollerProperties();
    scrollerproperties.setScrollMetric(QScrollerProperties::AxisLockThreshold, 1);
    scrollerproperties.setScrollMetric(QScrollerProperties::OvershootScrollTime, G_LOCALSETTINGS.get("ui.animationdelay").toFloat() / 1000);
    QScroller::scroller(m_license_s)->setScrollerProperties(scrollerproperties);
    QScroller::grabGesture(m_license_s, QScroller::LeftMouseButtonGesture);

    m_UIratio2 = G_LOCALSETTINGS.get("ui.ratio2").toInt();
}


InfoPanel::~InfoPanel()
{

}


void InfoPanel::install()
{
    QEvent langevent(QEvent::LanguageChange);
    changeEvent(&langevent);

    redraw();
    m_cframe1->setCollapsed(false);

    QFile lic(":/resources/license.txt");

    if (lic.open(QFile::ReadOnly)) {
        m_licensetext->setText(lic.readAll().trimmed().replace("#YEAR#", QByteArray::number(QDate::currentDate().year())));
        lic.close();
        m_origlicwidth = static_cast<float>(m_licensetext->sizeHint().width());
    }

    QDir dir(G_LOCALSETTINGS.localFilePath());
    QList<QString> logfiles = dir.entryList(QList<QString>() << "_Log_*.log");
    if (!logfiles.isEmpty()) {
        m_listfiles->addItems(logfiles);
        m_listfiles->setCurrentIndex(m_listfiles->count() - 1);
    }

    refreshLogs();

    emit installed();
}


void InfoPanel::messageIn(const Message &message) const
{
    Q_UNUSED(message)
}


void InfoPanel::changeEvent(QEvent *event)
{
    if (event->type() == QEvent::LanguageChange) {
        m_closebutton->setToolTip(tr("Close"));
        m_refreshbutton->setToolTip(tr("Refresh"));
        m_copybutton->setToolTip(tr("Copy to clipboard"));
        m_verbosebutton->setToolTip(tr("Verbose logging"));
        m_cframe1->setText(tr("ABOUT"));
        m_cframe2->setText(tr("LICENSE"));
        m_cframe3->setText(tr("DEBUG"));
    }
}


void InfoPanel::closeButtonClicked()
{
    emit closed();
}


void InfoPanel::copyButtonClicked() const
{
    QClipboard *clipboard = QApplication::clipboard();
    clipboard->setText(m_log->text());
}


void InfoPanel::logoButtonClicked() const
{
    QDesktopServices::openUrl(QUrl("https://nilibox.com"));
}


void InfoPanel::panelToggle(TcFrame *cpanel) const
{
    if (cpanel != m_cframe1)
        m_cframe1->setCollapsed(true);

    if (cpanel != m_cframe2)
        m_cframe2->setCollapsed(true);

    if (cpanel != m_cframe3)
        m_cframe3->setCollapsed(true);

    // This is a very dirty fix to adjust the size of the panes
    if (cpanel == m_cframe2 || cpanel == m_cframe3)
        QTimer::singleShot(50 + G_LOCALSETTINGS.get("ui.animationdelay").toInt(), this, &InfoPanel::redraw);
}


void InfoPanel::redraw() const
{
    m_refreshbutton->setSize(G_UNIT_L, G_UNIT_L);
    m_closebutton->setSize(G_UNIT_L, G_UNIT_L);
    m_logo->setSize(3 * G_UNIT_L * m_logo->pixmap().size() / m_logo->pixmap().height());
    m_version->setHeight(3 * G_UNIT_L);
    m_about->setHeight(qMax(m_logo->height(), m_version->height()) + m_about->verticalGap());
    m_license->setHeight(height() - m_license->mapTo(this, m_license->pos()).y() - G_UNIT_L - 2 * m_license->spacing());
    if (!m_cframe2->isCollapsed()) {
        m_licensetext->setFontRatio(qMin(1.0, static_cast<float>(m_license->width()) / m_origlicwidth));
        m_licensetext->setSize(m_licensetext->sizeHint());
    }
    m_copybutton->setHeight(G_UNIT_L);
    m_verbosebutton->setHeight(G_UNIT_L);
    m_listfiles->setHeight(G_UNIT_L);
    m_debug->setHeight(height() - m_debug->mapTo(this, m_debug->pos()).y() - 2 * m_debug->spacing());
    m_log->setSize(m_log->sizeHint());
    m_frame1->setMaximumWidth(m_UIratio2 * G_UNIT_L);
}


void InfoPanel::refreshLogs() const
{
    QFile file(G_LOCALSETTINGS.localFilePath() + "/" + m_listfiles->currentText());
    if (file.open(QIODevice::ReadOnly | QIODevice::Text)) {
        m_log->setText(QString(file.readAll()).trimmed());
        m_log->setFixedSize(m_log->sizeHint());
        file.close();
        redraw();
    }
}


void InfoPanel::resizeEvent(QResizeEvent *event)
{
    TPane::resizeEvent(event);
    redraw();
}


void InfoPanel::verboseButtonClicked() const
{
    G_VERBOSE = m_verbosebutton->isPressed();
    G_LOCALSETTINGS.set("system.verbose", G_VERBOSE ? "true" : "false");
}
