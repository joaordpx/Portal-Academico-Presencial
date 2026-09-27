import React, { useState, useEffect, useRef } from 'react';
import styles from './ChecklistCalouro.module.css';
import { useChecklist } from '../../../hooks/useChecklist';

export const ChecklistCalouro: React.FC = () => {
  const {
    tarefas,
    loading,
    error,
    currentPage,
    lastPage,
    carregarPagina,
  } = useChecklist(10);

  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [isVisible, setIsVisible] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const toggleItem = (id: number) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const irParaPaginaAnterior = () => {
    if (currentPage > 1) {
      carregarPagina(currentPage - 1);
    }
  };

  const irParaProximaPagina = () => {
    if (currentPage < lastPage) {
      carregarPagina(currentPage + 1);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`${styles.wrapper} ${
        isVisible ? styles.animateIn : ''
      }`}
    >
      <div className={styles.mainCardWrapper}>
        <div className={styles.titleWrapper}>
          <h2 className={styles.mainTitle}>
            Sua primeira semana.
          </h2>

          <div className={styles.titleLine} />
        </div>

        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <div className={styles.colFeito}>Feito</div>
            <div className={styles.colNum}>n°</div>
            <div className={styles.colTarefa}>Tarefa</div>
          </div>

          <div className={styles.tableBody}>
            {loading && (
              <div className={styles.tableRow}>
                <div className={styles.colTarefa}>
                  <p className={styles.taskText}>
                    Carregando tarefas...
                  </p>
                </div>
              </div>
            )}

            {!loading && error && (
              <div className={styles.tableRow}>
                <div className={styles.colTarefa}>
                  <p className={styles.taskText}>
                    {error}
                  </p>
                </div>
              </div>
            )}

            {!loading &&
              !error &&
              tarefas.map((item, index) => {
                const isChecked = !!checkedItems[item.id];

                return (
                  <div
                    key={item.id}
                    className={`${styles.tableRow} ${
                      isChecked ? styles.rowChecked : ''
                    }`}
                    onClick={() => toggleItem(item.id)}
                    style={{
                      animationDelay: `${index * 0.05}s`,
                    }}
                  >
                    <div className={styles.colFeito}>
                      <div
                        className={`${styles.checkboxBox} ${
                          isChecked ? styles.checked : ''
                        }`}
                      >
                        {isChecked && (
                          <svg
                            className={styles.checkIcon}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3.5"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                    </div>

                    <div className={styles.colNum}>
                      <span className={styles.numBadge}>
                        {item.ordem}
                      </span>
                    </div>

                    <div className={styles.colTarefa}>
                      <p className={styles.taskText}>
                        {item.texto}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {lastPage > 1 && !loading && !error && (
          <div className={styles.pagination}>
            <button
              type="button"
              className={styles.paginationButton}
              onClick={irParaPaginaAnterior}
              disabled={currentPage === 1}
            >
              ← Anterior
            </button>

            <span className={styles.paginationInfo}>
              Página {currentPage} de {lastPage}
            </span>

            <button
              type="button"
              className={styles.paginationButton}
              onClick={irParaProximaPagina}
              disabled={currentPage === lastPage}
            >
              Próxima →
            </button>
          </div>
        )}

        <div className={styles.tipBox}>
          <div className={styles.tipIconWrapper}>
            <span className={styles.tipExclamation}>!</span>
          </div>

          <div className={styles.tipContent}>
            <strong>Dica de organização:</strong>

            <p>
              Crie uma pasta no drive do seu email e coloque lá todas
              as suas informações importantes. Fiquem de olho nos
              editais e oportunidades.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};