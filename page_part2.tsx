            {currentStep === 3 && !isDone && (
              <div className="max-w-2xl mx-auto space-y-5 sm:space-y-7">
                <h3 className="text-base font-bold text-[#1e3a5f] mb-1 flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-[#1e3a5f]" />
                  Дополнительные услуги
                </h3>
                {step3Services.map((service, idx) => {
                  const selected = step3Selections.includes(service.id)
                  const step3IconMap: Record<string, React.ComponentType<{className?: string}>> = {
                    ecp_renewal: Key,
                    training: GraduationCap,
                    fn_replacement: RotateCcw,
                    maintenance_contract: Wrench,
                  }
                  const ServiceIcon = step3IconMap[service.id]
                  return (
                    <Card key={service.id} className={selected ? 'border-[#1e3a5f] bg-[#1e3a5f]/[0.03]' : 'border-slate-200'}>
                      <CardContent className="pt-5 sm:pt-6 animate-fade-in-up" style={{ animationDelay: `${idx * 50}ms` }}>
                        <div className="flex items-start gap-3">
                          <Checkbox id={service.id} checked={selected}
                            onCheckedChange={() => setStep3Selections(prev => prev.includes(service.id) ? prev.filter(x => x !== service.id) : [...prev, service.id])}
                            className="w-6 h-6 mt-0.5 shrink-0" />
                          {ServiceIcon && <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1e3a5f]/10 flex items-center justify-center shrink-0"><ServiceIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#1e3a5f]" /></div>}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <Label htmlFor={service.id} className="font-bold text-base cursor-pointer leading-snug">{service.name}</Label>
                                {service.hintKey && <HintButton hintKey={service.hintKey} />}
                              </div>
                              <span className="font-bold text-[#1e3a5f] whitespace-nowrap shrink-0 text-sm sm:text-base">{service.price.toLocaleString('ru-RU')} руб.</span>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-500 mt-1">{service.description}</p>
                            {service.id === 'training' && selected && (
                              <div className="mt-3 flex items-center gap-2">
                                <Label className="text-sm shrink-0">Часов:</Label>
                                <Input type="number" min={1} max={10} value={trainingHours}
                                  onChange={(e) => setTrainingHours(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))} className="w-20" />
                                <span className="text-sm text-slate-500">= {(service.price * trainingHours).toLocaleString('ru-RU')} руб.</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}

                <div className="flex gap-4">
                  <Button variant="outline" className="flex-1 py-5 sm:py-6 text-base sm:text-lg font-bold" size="lg" onClick={() => { setCurrentStep(2); setTimeout(() => mainRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50) }}><ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 mr-2" /> Назад</Button>
                  <Button className="flex-1 bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 py-5 sm:py-6 text-base sm:text-lg font-bold" size="lg" onClick={() => goToStep(4)} disabled={!canGoStep4}>Далее <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-2" /></Button>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* КОНТАКТНЫЕ ДАННЫЕ И ИТОГ */}
            {/* ============================================================ */}
            {currentStep === 4 && !isDone && (
              <div className="max-w-3xl mx-auto">
                <div className="grid lg:grid-cols-3 gap-5 sm:gap-7">
                  <div className="lg:col-span-2 space-y-5 sm:space-y-7">
                    <div className="p-2.5 sm:p-3 bg-[#1e3a5f]/5 border border-[#1e3a5f]/10 rounded-lg text-xs sm:text-sm">
                      <p className="text-[#1e3a5f]"><strong>Касса:</strong> {effectiveKkmInfo.name} | <strong>Основные услуги:</strong> {step2Selections.length} шт. | <strong>Доп. услуги:</strong> {step3Selections.length} шт.</p>
                    </div>

                    {/* Контактные данные */}
                    <Card className="border-[#1e3a5f]/20">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm sm:text-base flex items-center gap-2"><Info className="w-4 h-4 sm:w-5 sm:h-5 text-[#1e3a5f] shrink-0" />Информация о владельце и ККТ</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <Label className="text-sm">Наименование (юрлицо / ИП) <span className="text-red-500">*</span></Label>
                          <Input value={clientData.name} onChange={(e) => setClientData({...clientData, name: e.target.value})} placeholder="ООО «Ромашка»" className="mt-1" />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-3">
                          <div>
                            <Label className="text-sm">Телефон <span className="text-red-500">*</span></Label>
                            <Input type="tel" value={clientData.phone} onChange={(e) => setClientData({...clientData, phone: e.target.value})} placeholder="+7" className="mt-1" />
                          </div>
                          <div>
                            <Label className="text-sm">Электронная почта</Label>
                            <Input type="email" value={clientData.email} onChange={(e) => setClientData({...clientData, email: e.target.value})} className="mt-1" />
                          </div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-3">
                          <div>
                            <Label className="text-sm">ИНН <span className="text-red-500">*</span></Label>
                            <Input value={clientData.inn} onChange={(e) => setClientData({...clientData, inn: e.target.value})} className="mt-1" />
                          </div>
                          <div>
                            <Label className="text-sm">Адрес установки ККТ</Label>
                            <Input list="ru-addresses" value={clientData.address} onChange={(e) => setClientData({...clientData, address: e.target.value})} className="mt-1" />
                            <datalist id="ru-addresses">
                              <option value="г. Москва" /><option value="г. Санкт-Петербург" /><option value="г. Новосибирск" /><option value="г. Екатеринбург" /><option value="г. Казань" /><option value="г. Нижний Новгород" /><option value="г. Челябинск" /><option value="г. Самара" /><option value="г. Омск" /><option value="г. Ростов-на-Дону" /><option value="г. Уфа" /><option value="г. Красноярск" /><option value="г. Воронеж" /><option value="г. Пермь" /><option value="г. Волгоград" /><option value="г. Краснодар" /><option value="г. Саратов" /><option value="г. Тюмень" /><option value="г. Тольятти" /><option value="г. Ижевск" /><option value="г. Барнаул" /><option value="г. Ульяновск" /><option value="г. Иркутск" /><option value="г. Хабаровск" /><option value="г. Ярославль" /><option value="г. Владивосток" /><option value="г. Махачкала" /><option value="г. Томск" /><option value="г. Оренбург" /><option value="г. Кемерово" /><option value="г. Рязань" /><option value="г. Астрахань" /><option value="г. Набережные Челны" /><option value="г. Пенза" /><option value="г. Липецк" /><option value="г. Тула" /><option value="г. Калининград" /><option value="г. Балашиха" /><option value="г. Курск" /><option value="г. Ставрополь" /><option value="г. Улан-Удэ" /><option value="г. Тверь" /><option value="г. Белгород" /><option value="г. Сочи" /><option value="г. Нижний Тагил" /><option value="г. Архангельск" /><option value="г. Волжский" /><option value="г. Калуга" /><option value="г. Сургут" /><option value="г. Чебоксары" /><option value="г. Ковров" /><option value="г. Иваново" /><option value="г. Брянск" /><option value="г. Смоленск" /><option value="г. Вологда" /><option value="г. Орёл" /><option value="г. Владимир" /><option value="г. Мурманск" /><option value="г. Череповец" /><option value="г. Тамбов" /><option value="г. Петрозаводск" /><option value="г. Кострома" /><option value="г. Новороссийск" /><option value="г. Таганрог" /><option value="г. Сыктывкар" /><option value="г. Комсомольск-на-Амуре" /><option value="г. Нальчик" /><option value="г. Йошкар-Ола" /><option value="г. Грозный" /><option value="г. Дзержинск" /><option value="г. Шахты" /><option value="г. Братск" /><option value="г. Псков" /><option value="г. Ангарск" /><option value="г. Нижневартовск" /><option value="г. Бийск" /><option value="г. Курган" /><option value="г. Прокопьевск" /><option value="г. Рыбинск" /><option value="г. Севастополь" /><option value="г. Симферополь" /><option value="г. Краснодарский край" /><option value="г. Ленинградская область" /><option value="г. Московская область" /><option value="Республика Татарстан" /><option value="Республика Башкортостан" /><option value="Краснодарский край" /><option value="Ставропольский край" /><option value="Республика Крым" />
                            </datalist>
                          </div>
                        </div>
                        {kkmType === 'evotor' && (
                          <div className="p-3 bg-[#1e3a5f]/5 rounded-lg space-y-3">
                            <p className="text-sm text-[#1e3a5f] font-medium flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 shrink-0" />Данные от ЛК Эвотор
                            </p>
                            <div className="grid sm:grid-cols-2 gap-3">
                              <div>
                                <Label className="text-sm">Логин (телефон)</Label>
                                <Input type="tel" value={clientData.evotorLogin} onChange={(e) => setClientData({...clientData, evotorLogin: e.target.value})} className="mt-1" />
                              </div>
                              <div>
                                <Label className="text-sm">Пароль</Label>
                                <Input type="password" value={clientData.evotorPassword} onChange={(e) => setClientData({...clientData, evotorPassword: e.target.value})} className="mt-1" />
                              </div>
                            </div>
                            <div className="flex items-center gap-3 p-2.5 bg-[#e8a817]/10 border border-[#e8a817]/30 rounded-lg">
                              <Checkbox id="evotor_restore_r" checked={evotorRestore} onCheckedChange={(c) => setEvotorRestore(c as boolean)} className="w-5 h-5 shrink-0" />
                              <Label htmlFor="evotor_restore_r" className="cursor-pointer text-xs text-[#1e3a5f]">Нет данных ЛК — помощь с восстановлением <span className="font-semibold">500 руб.</span></Label>
                            </div>
                          </div>
                        )}
                        <div>
                          <Label className="text-sm">Серийный номер ККТ {needsSerialNumber && <span className="text-red-500">*</span>}</Label>
                          <Input value={clientData.kkmNumber} onChange={(e) => setClientData({...clientData, kkmNumber: e.target.value})} placeholder={needsSerialNumber ? 'Обязательное поле — на корпусе кассы' : 'На корпусе кассы (если знаете)'} className="mt-1" />
                          {needsSerialNumber && <p className="text-xs text-slate-400 mt-1">Обязателен для касс {effectiveKkmInfo.name}</p>}
                        </div>
                        <div>
                          <Label className="text-sm">Примечания</Label>
                          <Input value={clientData.comment} onChange={(e) => setClientData({...clientData, comment: e.target.value})} placeholder="Дополнительная информация" className="mt-1" />
                        </div>
                        <p className="text-xs text-red-500 font-medium">* Название, телефон, ИНН{needsSerialNumber ? ' и серийный номер ККТ' : ''} обязательны</p>
                      </CardContent>
                    </Card>

                    <div className="flex gap-4">
                      <Button variant="outline" className="flex-1 py-5 sm:py-6 text-base sm:text-lg font-bold" size="lg" onClick={() => { setCurrentStep(3); setTimeout(() => mainRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50) }}><ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 mr-2" /> Назад</Button>
                    </div>
                  </div>

                  {/* ===== ПРАВАЯ КОЛОНКА ===== */}
                  <div className="lg:col-span-1">
                    <div className="sticky top-4 sm:top-6 space-y-5 sm:space-y-6">
                      <Card className="border-[#1e3a5f]/20 bg-white">
                        <CardHeader className="pb-2">
                          <CardTitle className="flex items-center gap-2 text-[#1e3a5f] text-sm sm:text-base"><CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />Расчёт стоимости</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 mb-4">
                            {totalCalc.items.length === 0 ? <p className="text-sm text-slate-500 italic">Отметьте услуги</p>
                              : totalCalc.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-xs sm:text-sm gap-2">
                                  <span className="text-slate-600 leading-snug break-words">{item.name}</span>
                                  <span className="font-medium whitespace-nowrap shrink-0">{item.price.toLocaleString('ru-RU')} ₽</span>
                                </div>
                              ))}
                          </div>
                          <Separator className="my-3" />
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-base sm:text-lg">Итого:</span>
                            <span className="font-bold text-xl sm:text-2xl text-[#1e3a5f]">{totalCalc.total.toLocaleString('ru-RU')} ₽</span>
                          </div>
          <p className="text-xs text-slate-400 mt-2">Касса: {effectiveKkmInfo.name}</p>
          <p className="text-xs text-slate-400">
            {kkmType === 'evotor' ? 'ТС ПИоТ, приложения Эвотор — отдельно' : effectiveKkm === 'sigma' ? 'ТС ПИоТ, подписки Сигма — отдельно' : 'ТС ПИоТ — оплачивается отдельно'}
          </p>
                        </CardContent>
                      </Card>

                      <Button className="w-full bg-[#e8a817] hover:bg-[#d49a12] py-5 sm:py-6 text-lg sm:text-xl font-bold" size="lg" disabled={!clientData.name.trim() || !clientData.phone.trim() || !clientData.inn.trim() || (needsSerialNumber && !clientData.kkmNumber.trim())} onClick={async () => {
                        const orderNum = Date.now().toString().slice(-6)
                        const orderDate = new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
                        const condLabelFull = kkmCondition === 'new' ? 'Новая' : kkmCondition === 'used' ? 'Б/у' : 'Старая (рабочая)'
                        try {
                          await fetch('/api/send-order', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ to: 'janicacid@gmail.com', subject: `Заказ-наряд №${orderNum} от ${orderDate} — ${clientData.name}`, html: `<div style="font-family:Arial,sans-serif;max-width:700px;margin:0 auto;color:#1e293b"><div style="background:#1e3a5f;color:white;padding:20px;text-align:center;border-radius:8px 8px 0 0"><h1 style="margin:0;font-size:20px">ЗАКАЗ-НАРЯД №${orderNum}</h1><p style="margin:4px 0 0;opacity:0.8;font-size:14px">ООО «Теллур-Интех» — ${orderDate}</p></div><div style="padding:20px;background:white;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px"><h2 style="color:#1e3a5f;font-size:16px;border-bottom:2px solid #1e3a5f;padding-bottom:6px;margin-top:0">Клиент</h2><p><strong>Наименование:</strong> ${clientData.name}</p>${clientData.inn ? `<p><strong>ИНН:</strong> ${clientData.inn}</p>` : ''}<p><strong>Телефон:</strong> ${clientData.phone}</p>${clientData.email ? `<p><strong>Email:</strong> ${clientData.email}</p>` : ''}${clientData.address ? `<p><strong>Адрес:</strong> ${clientData.address}</p>` : ''}<h2 style="color:#1e3a5f;font-size:16px;border-bottom:2px solid #1e3a5f;padding-bottom:6px">Касса</h2><p><strong>Тип:</strong> ${effectiveKkmInfo.name}</p><p><strong>Состояние:</strong> ${condLabelFull}</p>${clientData.kkmModel ? `<p><strong>Модель:</strong> ${clientData.kkmModel}</p>` : ''}${totalCalc.items.length > 0 ? `<h2 style="color:#1e3a5f;font-size:16px;border-bottom:2px solid #1e3a5f;padding-bottom:6px">Услуги</h2><table style="width:100%;border-collapse:collapse;margin:12px 0"><thead><tr style="background:#f1f5f9"><th style="border:1px solid #cbd5e1;padding:8px;text-align:left">№</th><th style="border:1px solid #cbd5e1;padding:8px;text-align:left">Наименование</th><th style="border:1px solid #cbd5e1;padding:8px;text-align:right">Сумма</th></tr></thead><tbody>${totalCalc.items.map((item, idx) => `<tr><td style="border:1px solid #cbd5e1;padding:8px">${idx + 1}</td><td style="border:1px solid #cbd5e1;padding:8px">${item.name}</td><td style="border:1px solid #cbd5e1;padding:8px;text-align:right">${item.price.toLocaleString('ru-RU')} ₽</td></tr>`).join('')}</tbody></table><p style="font-size:18px;font-weight:bold;text-align:right">ИТОГО: ${totalCalc.total.toLocaleString('ru-RU')} ₽</p>` : ''}</div></div>` })
                          })
                        } catch { /* silent */ }
                        setIsDone(true); setTimeout(() => mainRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
                      }}>
                        <CheckCheck className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        Готово
                      </Button>
                      <Button variant="outline" className="w-full text-sm" onClick={() => {
                        setStep2Selections([]); setStep3Selections([]); setScannerChecked(false); setProductCardCount(0); setTrainingHours(1); setFirmwareChecked(false); setLicenseChecked(false); setEvotorRestore(false); setOfdChecked(false)
                      }}>Сбросить всё</Button>

                      <Card className="bg-[#1e3a5f]/5">
                        <CardContent className="pt-4">
                          <h4 className="font-semibold mb-2 text-sm flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-[#e8a817] shrink-0" />Важно знать</h4>
                          <div className="space-y-2 text-xs sm:text-sm text-slate-600">
                            <p>С <strong>01.07.2026</strong> продажа маркированных товаров без ТС ПИоТ запрещена (<strong>ст. 15.12 КоАП РФ</strong>)</p>
                            <p>Лицензия ТС ПИоТ — на сайте <strong>ao-esp.ru</strong></p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-4">
                          <h4 className="font-semibold mb-3 text-sm">Контакты</h4>
                          <div className="space-y-2 text-xs sm:text-sm text-slate-600">
                            <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 shrink-0" />push@tellur.spb.ru</p>
                            <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 shrink-0" />+7 (812) 465-94-57</p>
                            <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 shrink-0" />+7 (812) 451-80-18</p>
                            <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 shrink-0" />+7 (812) 321-06-06</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
            )}

