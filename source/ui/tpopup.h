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

#if !defined TPOPUP_H
#define TPOPUP_H

#include "ui/tpane.h"

class QGraphicsOpacityEffect;
class QHBoxLayout;
class QPropertyAnimation;
class QVBoxLayout;
class TButton;
class TLabel;


class TPopup : public TPane
{
    Q_OBJECT

public:
    enum IconType {
        I_Information,
        I_Question,
        I_Warning,
        I_Critical
    };
    Q_ENUM(IconType)

    explicit                TPopup(QWidget *parent = nullptr);
    virtual                ~TPopup();

    void                    close() const;
    void                    exec();
    QString                 instance() const;
    bool                    isActive() const;
    void                    redraw();
    QString                 selected() const;
    void                    setButtons(const QList<QString> &buttons);
    void                    setIcon(const IconType &icon);
    void                    setInstance(const QString &instance);
    void                    setName(const QString &name);
    void                    setText(const QString &text);
    void                    setType(const QString &type);
    void                    setTypeName(const QString &type, const QString &name);

private:
    void                    animationFinished();
    void                    buttonClicked(TButton *button);
    void                    resizeEvent(QResizeEvent *event) override;

    QGraphicsOpacityEffect *m_opacity;
    QHBoxLayout            *m_blayout;
    QHBoxLayout            *m_hlayout;
    QList<QString>          m_buttons;
    QPropertyAnimation     *m_animation;
    QString                 m_imagecritical;
    QString                 m_imageinformation;
    QString                 m_imagequestion;
    QString                 m_imagewarning;
    QString                 m_instance;
    QString                 m_selected;
    QString                 m_text;
    QVBoxLayout            *m_layout;
    QVBoxLayout            *m_vlayout;
    TLabel                 *m_textbox;
    TPane                  *m_box;
    TPane                  *m_buttonsbox;
    TPane                  *m_contentbox;
    TPane                  *m_iconbox;
    bool                    m_active;

signals:
    void                    optionSelected();
};

#endif // BPOPUP_H
